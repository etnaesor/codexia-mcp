/**
 * CODEX·IA — list_statutes MCP Tool
 * Browsable catalog of indexed legislation
 */

import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import type { Database } from "sql.js-fts5";
import { z } from "zod";
import { queryAll } from "../db/query.js";

export function registerListStatutes(server: McpServer, db: Database): void {
	server.tool(
		"list_statutes",
		"Catálogo navegable de toda la legislación mexicana indexada. Filtra por materia jurídica y jurisdicción.",
		{
			materia: z.string().optional().describe("Filtrar: laboral, civil, penal, fiscal, mercantil, constitucional"),
			jurisdiction: z.string().optional().describe("Filtrar: federal, estatal:jalisco, etc."),
			limit: z.number().min(1).max(100).default(25).describe("Máximo de resultados"),
		},
		async ({ materia, jurisdiction, limit }) => {
			const conditions: string[] = [];
			const params: (string | number)[] = [];

			if (materia) { conditions.push("materia = ?"); params.push(materia); }
			if (jurisdiction) { conditions.push("jurisdiction = ?"); params.push(jurisdiction); }
			params.push(limit);

			const where = conditions.length > 0 ? `WHERE ${conditions.join(" AND ")}` : "";
			const sql = `
				SELECT code, title, materia, jurisdiction, last_reform_date,
					(SELECT COUNT(*) FROM provisions WHERE statute_id = statutes.id) AS article_count
				FROM statutes ${where} ORDER BY title LIMIT ?
			`;

			const rows = queryAll(db, sql, ...params);
			if (rows.length === 0) {
				return { content: [{ type: "text" as const, text: "No se encontraron leyes con los filtros especificados." }] };
			}

			const text = rows
				.map((r) => `• ${r.code} — ${r.title}\n  📂 ${r.materia ?? "sin clasificar"} | ${r.jurisdiction} | ${r.article_count} artículos${r.last_reform_date ? ` | Reforma: ${r.last_reform_date}` : ""}`)
				.join("\n\n");

			return { content: [{ type: "text" as const, text: `${rows.length} leyes encontradas:\n\n${text}` }] };
		}
	);
}
