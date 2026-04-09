/**
 * CODEX·IA — MCP Tools Registry
 * Registers all 4 MCP tools on the server
 */

import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import type { Database } from "sql.js-fts5";
import { registerSearchLaw } from "./search-law.js";
import { registerGetArticle } from "./get-article.js";
import { registerListStatutes } from "./list-statutes.js";
import { registerCheckUpdates } from "./check-updates.js";

export function registerTools(server: McpServer, db: Database): void {
	registerSearchLaw(server, db);
	registerGetArticle(server, db);
	registerListStatutes(server, db);
	registerCheckUpdates(server, db);
}
