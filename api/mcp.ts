/**
 * CODEX·IA — Vercel Serverless MCP Endpoint
 * Streamable HTTP transport for stateless serverless deployment.
 * Deploy: codexia.corpusia.net/mcp
 */

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/streamableHttp.js";
import { registerTools } from "../src/tools/index.js";
import { getDb } from "../src/db/connection.js";
import type { IncomingMessage, ServerResponse } from "http";

export default async function handler(req: IncomingMessage, res: ServerResponse) {
	res.setHeader("Access-Control-Allow-Origin", "*");
	res.setHeader("Access-Control-Allow-Methods", "GET, POST, DELETE, OPTIONS");
	res.setHeader("Access-Control-Allow-Headers", "Content-Type, mcp-session-id");
	res.setHeader("Access-Control-Expose-Headers", "mcp-session-id");

	if (req.method === "OPTIONS") {
		res.statusCode = 204;
		res.end();
		return;
	}

	try {
		const server = new McpServer({
			name: "codexia-mcp",
			version: "0.1.0",
			description: "CODEX·IA — Legislación mexicana completa via MCP",
		});

		const db = await getDb();
		registerTools(server, db);

		const transport = new StreamableHTTPServerTransport({
			sessionIdGenerator: undefined,
		});

		await server.connect(transport);
		await transport.handleRequest(req, res);
	} catch (error) {
		console.error("MCP server error:", error);
		if (!res.headersSent) {
			res.statusCode = 500;
			res.end(JSON.stringify({ error: "Internal server error" }));
		}
	}
}
