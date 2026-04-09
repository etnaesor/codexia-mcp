/**
 * CODEX·IA — check_updates MCP Tool
 * Drift detection against DOF for legislative reforms
 */

import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import type { Database } from "sql.js-fts5";
import { z } from "zod";
import { queryAll } from "../db/query.js";

export function registerCheckUpdates(server: McpServer, db: Database): void {
	server.tool(
		"check_updates",
		"Detecta reformas legislativas comparando la base local contra el Diario Oficial de la Federación (DOF).",
		{
			since: z.string().optional().describe("Fecha desde: YYYY-MM-DD. Default: últimos 30 días."),
			statute_code: z.string().optional().describe("Filtrar por ley: LFT, CFF"),
			materia: z.string().optional().describe("Filtrar por materia: fiscal, laboral"),
		},
		async ({ since, statute_code, materia }) => {
			try {
				const defaultSince = new Date();
				defaultSince.setDate(defaultSince.getDate() - 30);
				const sinceDate = since ?? defaultSince.toISOString().split("T")[0];

				const conditions: string[] = ["r.dof_date >= ?"];
				const params: (string | number)[] = [sinceDate];
				if (statute_code) { conditions.push("UPPER(s.code) = UPPER(?)"); params.push(statute_code); }
				if (materia) { conditions.push("s.materia = ?"); params.push(materia); }

				const sql = `
					SELECT r.dof_date, r.summary, r.dof_url, r.applied, s.code, s.title AS statute_title
					FROM reforms r JOIN statutes s ON s.id = r.statute_id
					WHERE ${conditions.join(" AND ")} ORDER BY r.dof_date DESC
				`;

				const reforms = queryAll(db, sql, ...params);
				if (reforms.length === 0) {
					return { content: [{ type: "text" as const, text: `✅ No se detectaron reformas desde ${sinceDate}. La base de datos está actualizada.` }] };
				}

				const pending = reforms.filter((r) => !r.applied).length;
				const text = reforms
					.map((r) => `${r.applied ? "✅" : "⚠️"} ${r.dof_date} — ${r.code} (${r.statute_title})\n  ${r.summary ?? "Sin resumen"}${r.dof_url ? `\n  DOF: ${r.dof_url}` : ""}`)
					.join("\n\n");

				return { content: [{ type: "text" as const, text: `${reforms.length} reformas detectadas desde ${sinceDate} (${pending} pendientes):\n\n${text}` }] };
			} catch (err) {
				const message = err instanceof Error ? err.message : String(err);
				return {
					content: [{ type: "text" as const, text: `Error en drift detection: ${message}` }],
					isError: true,
				};
			}
		}
	);
}
