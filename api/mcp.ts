/**
 * CODEX·IA — Vercel Serverless MCP Endpoint
 * Handles MCP protocol over HTTP (SSE transport)
 * Deploy: codexia.corpusia.net/mcp
 */

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { SSEServerTransport } from "@modelcontextprotocol/sdk/server/sse.js";
import { registerTools } from "../src/tools/index.js";
import { getDb } from "../src/db/connection.js";
import type { IncomingMessage, ServerResponse } from "http";

export default async function handler(req: IncomingMessage, res: ServerResponse) {
	res.setHeader("Access-Control-Allow-Origin", "*");
	res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
	res.setHeader("Access-Control-Allow-Headers", "Content-Type");

	if (req.method === "OPTIONS") { res.statusCode = 204; res.end(); return; }

	try {
		const server = new McpServer({
			name: "codexia-mcp",
			version: "0.1.0",
			description: "CODEX·IA — Legislación mexicana completa via MCP",
		});

		const db = await getDb();
		registerTools(server, db);

		const transport = new SSEServerTransport("/api/mcp", res);
		await server.connect(transport);

		if (req.method === "POST") {
			await transport.handlePostMessage(req, res);
		}
	} catch (error) {
		console.error("MCP server error:", error);
		res.statusCode = 500;
		res.end(JSON.stringify({ error: "Internal server error" }));
	}
}
