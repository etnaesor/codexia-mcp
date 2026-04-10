#!/usr/bin/env node
/**
 * CODEX·IA — Local HTTP MCP Server
 * Stateful Streamable HTTP server for local testing.
 * Usage: npm run serve
 */

import { randomUUID } from "crypto";
import { createServer } from "http";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/streamableHttp.js";
import { registerTools } from "./tools/index.js";
import { getDb } from "./db/connection.js";

const PORT = parseInt(process.env.PORT ?? "3001", 10);

const sessions = new Map<string, StreamableHTTPServerTransport>();

async function createSession(): Promise<StreamableHTTPServerTransport> {
	const db = await getDb();
	const server = new McpServer({
		name: "codexia-mcp",
		version: "0.1.0",
		description: "CODEX·IA — Legislación mexicana completa via MCP (local)",
	});
	registerTools(server, db);

	const transport = new StreamableHTTPServerTransport({
		sessionIdGenerator: () => randomUUID(),
	});

	transport.onclose = () => {
		const sid = transport.sessionId;
		if (sid) sessions.delete(sid);
	};

	await server.connect(transport);
	return transport;
}

async function main() {
	const db = await getDb();
	const statCount = db.exec("SELECT COUNT(*) FROM statutes")[0].values[0][0];
	const provCount = db.exec("SELECT COUNT(*) FROM provisions")[0].values[0][0];

	const httpServer = createServer(async (req, res) => {
		res.setHeader("Access-Control-Allow-Origin", "*");
		res.setHeader("Access-Control-Allow-Methods", "GET, POST, DELETE, OPTIONS");
		res.setHeader("Access-Control-Allow-Headers", "Content-Type, mcp-session-id");
		res.setHeader("Access-Control-Expose-Headers", "mcp-session-id");

		if (req.method === "OPTIONS") {
			res.writeHead(204);
			res.end();
			return;
		}

		if (req.url === "/health") {
			res.writeHead(200, { "Content-Type": "application/json" });
			res.end(JSON.stringify({
				status: "ok",
				tools: 4,
				version: "0.1.0",
				sessions: sessions.size,
				statutes: statCount,
				provisions: provCount,
			}));
			return;
		}

		if (req.url === "/mcp" || req.url?.startsWith("/mcp")) {
			const sessionId = req.headers["mcp-session-id"] as string | undefined;

			try {
				if (sessionId && sessions.has(sessionId)) {
					// Existing session
					const transport = sessions.get(sessionId)!;
					await transport.handleRequest(req, res);
				} else if (!sessionId) {
					// New session (initialize request)
					const transport = await createSession();
					await transport.handleRequest(req, res);
					if (transport.sessionId) {
						sessions.set(transport.sessionId, transport);
					}
				} else {
					// Invalid session
					res.writeHead(404, { "Content-Type": "application/json" });
					res.end(JSON.stringify({ error: "Session not found. Send initialize request without mcp-session-id." }));
				}
			} catch (err) {
				if (!res.headersSent) {
					res.writeHead(500, { "Content-Type": "application/json" });
					res.end(JSON.stringify({ error: String(err) }));
				}
			}
			return;
		}

		res.writeHead(404, { "Content-Type": "application/json" });
		res.end(JSON.stringify({ error: "Not found. Use /mcp or /health." }));
	});

	httpServer.listen(PORT, () => {
		console.log(`\n🏛️  CODEX·IA — Local MCP Server`);
		console.log(`📡 MCP Endpoint:  http://localhost:${PORT}/mcp`);
		console.log(`💚 Health Check:  http://localhost:${PORT}/health`);
		console.log(`📊 Database:      ${statCount} leyes, ${provCount} artículos`);
		console.log(`\n🔧 Configuración para Claude Desktop (claude_desktop_config.json):\n`);
		console.log(`   Opción A — Stdio (recomendado):`);
		console.log(`   {`);
		console.log(`     "mcpServers": {`);
		console.log(`       "codexia": {`);
		console.log(`         "command": "npx",`);
		console.log(`         "args": ["tsx", "${process.cwd().replace(/\\/g, "\\\\")}/src/index.ts"]`);
		console.log(`       }`);
		console.log(`     }`);
		console.log(`   }\n`);
		console.log(`   Opción B — HTTP (este servidor):`);
		console.log(`   {`);
		console.log(`     "mcpServers": {`);
		console.log(`       "codexia": {`);
		console.log(`         "type": "url",`);
		console.log(`         "url": "http://localhost:${PORT}/mcp"`);
		console.log(`       }`);
		console.log(`     }`);
		console.log(`   }\n`);
		console.log(`Ctrl+C para detener.\n`);
	});
}

main().catch((err) => {
	console.error("❌", err);
	process.exit(1);
});
