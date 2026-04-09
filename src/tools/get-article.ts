/**
 * CODEX·IA — get_article MCP Tool
 * Returns verbatim text of a specific article. Zero LLM summarization.
 */

import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import type { Database } from "sql.js-fts5";
import { z } from "zod";
import { queryOne } from "../db/query.js";

export function registerGetArticle(server: McpServer, db: Database): void {
	server.tool(
		"get_article",
		"Obtiene el texto VERBATIM de un artículo específico de la legislación mexicana. Sin parafraseo, sin resumen — exactamente lo que dice la ley.",
		{
			statute_code: z.string().describe("Código de la ley: CPEUM, LFT, CCF, CFF, LGIMH"),
			article: z.string().describe("Número del artículo: 123, 48, 2412, 1-Bis"),
		},
		async ({ statute_code, article }) => {
			const sql = `
				SELECT p.article_number, p.title AS article_title,
					p.body, p.chapter, p.section,
					s.code, s.title AS statute_title,
					s.last_reform_date, s.source_url
				FROM provisions p
				JOIN statutes s ON s.id = p.statute_id
				WHERE UPPER(s.code) = UPPER(?)
				AND p.article_number = ?
			`;

			const row = queryOne(db, sql, statute_code, article);

			if (!row) {
				return {
					content: [{
						type: "text" as const,
						text: `No se encontró el Art. ${article} en ${statute_code}. Verifica el código de la ley y el número de artículo.`,
					}],
				};
			}

			const header = `${row.code} — ${row.statute_title}`;
			const location = [row.chapter, row.section].filter(Boolean).join(" > ");
			const reform = row.last_reform_date ? `Última reforma: ${row.last_reform_date}` : "";
			const source = row.source_url ? `Fuente: ${row.source_url}` : "";

			const text = [
				header,
				location ? `📍 ${location}` : "",
				"",
				`Art. ${row.article_number}${row.article_title ? `. ${row.article_title}` : ""}`,
				"",
				row.body as string,
				"",
				reform,
				source,
				"",
				"⚠️ Texto verbatim de fuente oficial. No ha sido parafraseado ni resumido.",
			].filter(Boolean).join("\n");

			return {
				content: [{ type: "text" as const, text }],
			};
		}
	);
}
