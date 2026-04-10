/**
 * CODEX·IA — E2E MCP Server Tests
 * Tests the stdio transport with real JSON-RPC messages.
 */

import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { spawn, type ChildProcess } from "child_process";
import { resolve } from "path";

let proc: ChildProcess;
let responses: string[] = [];

function sendMessage(msg: object): void {
	proc.stdin!.write(JSON.stringify(msg) + "\n");
}

function waitForResponse(id: number, timeoutMs = 5000): Promise<Record<string, unknown>> {
	return new Promise((resolve, reject) => {
		const start = Date.now();
		const check = setInterval(() => {
			for (const line of responses) {
				try {
					const parsed = JSON.parse(line);
					if (parsed.id === id) {
						clearInterval(check);
						resolve(parsed);
						return;
					}
				} catch { /* skip non-JSON */ }
			}
			if (Date.now() - start > timeoutMs) {
				clearInterval(check);
				reject(new Error(`Timeout waiting for response id=${id}`));
			}
		}, 50);
	});
}

beforeAll(async () => {
	const entry = resolve(import.meta.dirname ?? ".", "../src/index.ts");
	proc = spawn("npx", ["tsx", entry], {
		stdio: ["pipe", "pipe", "pipe"],
		shell: true,
	});

	proc.stdout!.on("data", (chunk: Buffer) => {
		const lines = chunk.toString().split("\n").filter(Boolean);
		responses.push(...lines);
	});

	// Initialize
	sendMessage({
		jsonrpc: "2.0",
		method: "initialize",
		params: {
			protocolVersion: "2024-11-05",
			capabilities: {},
			clientInfo: { name: "e2e-test", version: "1.0" },
		},
		id: 1,
	});

	await waitForResponse(1);

	sendMessage({ jsonrpc: "2.0", method: "notifications/initialized" });
	await new Promise((r) => setTimeout(r, 200));
});

afterAll(() => {
	if (proc && !proc.killed) {
		proc.kill();
	}
});

describe("E2E MCP Server", () => {
	it("should list 4 tools", async () => {
		sendMessage({ jsonrpc: "2.0", method: "tools/list", id: 10 });
		const res = await waitForResponse(10);
		const tools = (res.result as { tools: { name: string }[] }).tools;
		expect(tools).toHaveLength(4);
		const names = tools.map((t) => t.name);
		expect(names).toContain("search_law");
		expect(names).toContain("get_article");
		expect(names).toContain("list_statutes");
		expect(names).toContain("check_updates");
	});

	it("search_law should return results for 'constitución'", async () => {
		sendMessage({
			jsonrpc: "2.0",
			method: "tools/call",
			params: { name: "search_law", arguments: { query: "constitución", limit: 5 } },
			id: 20,
		});
		const res = await waitForResponse(20);
		const content = (res.result as { content: { text: string }[] }).content;
		expect(content[0].text).toContain("resultados para");
	});

	it("get_article should return CPEUM Art. 1 verbatim", async () => {
		sendMessage({
			jsonrpc: "2.0",
			method: "tools/call",
			params: { name: "get_article", arguments: { statute_code: "CPEUM", article: "1" } },
			id: 30,
		});
		const res = await waitForResponse(30);
		const text = (res.result as { content: { text: string }[] }).content[0].text;
		expect(text).toContain("CPEUM");
		expect(text).toContain("derechos humanos");
		expect(text).toContain("Texto verbatim");
	});

	it("get_article should handle non-existent article", async () => {
		sendMessage({
			jsonrpc: "2.0",
			method: "tools/call",
			params: { name: "get_article", arguments: { statute_code: "CPEUM", article: "9999" } },
			id: 31,
		});
		const res = await waitForResponse(31);
		const text = (res.result as { content: { text: string }[] }).content[0].text;
		expect(text).toContain("No se encontró");
	});

	it("list_statutes should list laws by materia", async () => {
		sendMessage({
			jsonrpc: "2.0",
			method: "tools/call",
			params: { name: "list_statutes", arguments: { materia: "constitucional" } },
			id: 40,
		});
		const res = await waitForResponse(40);
		const text = (res.result as { content: { text: string }[] }).content[0].text;
		expect(text).toContain("CPEUM");
	});

	it("check_updates should report no pending reforms", async () => {
		sendMessage({
			jsonrpc: "2.0",
			method: "tools/call",
			params: { name: "check_updates", arguments: {} },
			id: 50,
		});
		const res = await waitForResponse(50);
		const text = (res.result as { content: { text: string }[] }).content[0].text;
		expect(text).toContain("No se detectaron reformas");
	});
});
