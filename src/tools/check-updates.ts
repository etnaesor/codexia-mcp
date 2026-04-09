/**
 * CODEX·IA — check_updates MCP Tool
 * Drift detection: compares local DB against DOF for legislative reforms
 */

import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import type Database from "better-sqlite3";
import { z } from "zod";

export function registerCheckUpdates(server: McpServer, db: Database.Database): void {
	server.tool(
		"check_updates",
		"Detecta reformas legislativas comparando la base local contra el Diario Oficial de la Federación (DOF). Muestra artículos potencialmente desactualizados.",
		{
			since: z.string().optional().describe("Fecha desde la cual buscar reformas. Formato: YYYY-MM-DD. Default: últimos 30 días."),
			statute_code: z.string().optional().describe("Filtrar por ley específica. Ej: 'LFT', 'CFF'"),
			materia: z.string().optional().describe("Filtrar por materia: fiscal, laboral, etc."),
		},
		async ({ since, statute_code, materia }) => {
			const defaultSince = new Date();
			defaultSince.setDate(defaultSince.getDate() - 30);
			const sinceDate = since ?? defaultSince.toISOString().split("T")[0];

			const conditions: string[] = ["r.dof_date >= ?"];
			const params: (string | number)[] = [sinceDate];

			if (statute_code) {
				conditions.push("UPPER(s.code) = UPPER(?)");
				params.push(statute_code);
			}
			if (materia) {
				conditions.push("s.materia = ?");
				params.push(materia);
			}

			const sql = `
				SELECT
					r.dof_date,
					r.summary,
					r.dof_url,
					r.applied,
					s.code,
					s.title AS statute_title
				FROM reforms r
				JOIN statutes s ON s.id = r.statute_id
				WHERE ${conditions.join(" AND ")}
				ORDER BY r.dof_date DESC
			`;

			const reforms = db.prepare(sql).all(...params) as Array<{
				dof_date: string;
				summary: string | null;
				dof_url: string | null;
				applied: number;
				code: string;
				statute_title: string;
			}>;

			if (reforms.length === 0) {
				return {
					content: [{
						type: "text" as const,
						text: `✅ No se detectaron reformas desde ${sinceDate}. La base de datos está actualizada.`,
					}],
				};
			}

			const pending = reforms.filter((r) => !r.applied).length;
			const text = reforms
				.map((r) =>
					`${r.applied ? "✅" : "⚠️"} ${r.dof_date} — ${r.code} (${r.statute_title})\n  ${r.summary ?? "Sin resumen"}${r.dof_url ? `\n  DOF: ${r.dof_url}` : ""}`
				)
				.join("\n\n");

			return {
				content: [{
					type: "text" as const,
					text: `${reforms.length} reformas detectadas desde ${sinceDate} (${pending} pendientes de aplicar):\n\n${text}`,
				}],
			};
		}
	);
}
