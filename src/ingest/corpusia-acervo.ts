/**
 * CODEX·IA — CORPUSIA Acervo Ingest
 * Seeds DB from CORPUSIA's existing 1,063 processed legal documents
 */

import type { Database } from "sql.js-fts5";
import type { IngestResult } from "./camara-diputados.js";

export async function ingestCorpusiaAcervo(_db: Database, _acervoPath?: string): Promise<IngestResult> {
	console.log("⏳ CORPUSIA acervo ingest not yet implemented");
	return { source: "corpusia_acervo", documentsProcessed: 0, provisionsCreated: 0, errors: ["Phase 1 — Seed"] };
}
