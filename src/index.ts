#!/usr/bin/env node
/**
 * CODEX·IA — Mexican Law MCP Server
 * Entry point: starts the MCP server via stdio transport
 *
 * @package @corpusia/codexia-mcp
 * @license Apache-2.0
 * @see https://codexia.mx
 */

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { registerTools } from "./tools/index.js";
import { getDb } from "./db/connection.js";

const server = new McpServer({
	name: "codexia-mcp",
	version: "0.1.0",
	description: "CODEX·IA — Legislación mexicana completa via MCP. 59,000+ documentos legales con búsqueda full-text FTS5.",
});

// Initialize database and register tools
const db = await getDb();
registerTools(server, db);

// Start server with stdio transport
const transport = new StdioServerTransport();
await server.connect(transport);
