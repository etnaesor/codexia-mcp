/**
 * CODEX·IA — search_law MCP Tool
 * Full-text search across Mexican legislation using FTS5 snippet()
 */

import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import type Database from "better-sqlite3";
import { z } from "zod";

export function registerSearchLaw(server: McpServer, db: Database.Database): void {
	server.tool(
		"search_law",
		"Búsqueda full-text en la legislación mexicana. Devuelve artículos relevantes con snippets de contexto. Soporta operadores FTS5: AND, OR, NOT, NEAR().",
		{
			query: z.string().describe("Términos de búsqueda en español. Ej: 'derechos trabajador despido injustificado'"),
			limit: z.number().min(1).max(50).default(10).describe("Máximo de resultados (default: 10)"),
			materia: z.string().optional().describe("Filtrar por materia: laboral, civil, penal, fiscal, mercantil, etc."),
			jurisdiction: z.string().optional().describe("Filtrar por jurisdicción: federal, estatal:jalisco, etc."),
		},
		async ({ query, limit, materia, jurisdiction }) => {
			const conditions: string[] = [];
			const params: (string | number)[] = [query];

			if (materia) {
				conditions.push("AND s.materia = ?");
				params.push(materia);
			}
			if (jurisdiction) {
				conditions.push("AND s.jurisdiction = ?");
				params.push(jurisdiction);
			}

			params.push(limit);

			const sql = `
				SELECT
					p.id,
					s.code,
					s.title AS statute_title,
					p.article_number,
					snippet(provisions_fts, 2, '<b>', '</b>', '...', 32) AS snippet,
					rank
				FROM provisions_fts
				JOIN provisions p ON p.id = provisions_fts.rowid
				JOIN statutes s ON s.id = p.statute_id
				WHERE provisions_fts MATCH ?
				${conditions.join(" ")}
				ORDER BY rank
				LIMIT ?
			`;

			const results = db.prepare(sql).all(...params) as Array<{
				id: number;
				code: string;
				statute_title: string;
				article_number: string;
				snippet: string;
				rank: number;
			}>;

			if (results.length === 0) {
				return {
					content: [{ type: "text" as const, text: `No se encontraron resultados para: "${query}"` }],
				};
			}

			const text = results
				.map((r, i) =>
					`[${i + 1}] ${r.code} Art. ${r.article_number} — ${r.statute_title}\n${r.snippet}`
				)
				.join("\n\n");

			return {
				content: [{ type: "text" as const, text: `${results.length} resultados para "${query}":\n\n${text}` }],
			};
		}
	);
}
