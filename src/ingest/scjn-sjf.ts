/**
 * CODEX·IA — SCJN/SJF Bicentenario Ingest
 * Connects to SCJN Repositorio Bicentenario API for jurisprudence
 * Source: bicentenario.scjn.gob.mx — CSV/JSON open data
 * IMPORTANT: SCJN does maintenance overnight (503 before 8AM)
 *            Only run scrapers 9AM-10PM Mexico City time.
 *            The search UI is a JavaScript SPA — requires Playwright for scraping.
 */

import type Database from "better-sqlite3";
import type { IngestResult } from "./camara-diputados.js";

export async function ingestScjnSjf(
	_db: Database.Database
): Promise<IngestResult> {
	// TODO: Phase 2
	// 1. Download CSV/JSON bulk data from bicentenario.scjn.gob.mx
	// 2. Parse tesis aisladas and jurisprudencia
	// 3. Map to provisions table (epoch, instancia, materia, rubro, texto)
	// 4. Link to related statutes where possible
	// 5. Build FTS5 entries for searchability

	console.log("⏳ SCJN/SJF ingest not yet implemented");
	return { source: "scjn_sjf", documentsProcessed: 0, provisionsCreated: 0, errors: ["Phase 2"] };
}
