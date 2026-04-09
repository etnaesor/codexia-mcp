/**
 * CODEX·IA — CORPUSIA Acervo Ingest
 * Seeds DB from CORPUSIA's existing 1,063 processed legal documents
 * These docs are already parsed and structured — direct insert
 */

import type Database from "better-sqlite3";
import type { IngestResult } from "./camara-diputados.js";

export async function ingestCorpusiaAcervo(
	_db: Database.Database,
	_acervoPath?: string
): Promise<IngestResult> {
	// TODO: Phase 1 — Seed
	// 1. Read CORPUSIA acervo from MongoDB export or JSON files
	// 2. Map CORPUSIA document schema → statutes + provisions
	// 3. Preserve article-level granularity
	// 4. Insert and rebuild FTS5 index
	// 5. This is the SEED data — first content in the DB

	console.log("⏳ CORPUSIA acervo ingest not yet implemented");
	return { source: "corpusia_acervo", documentsProcessed: 0, provisionsCreated: 0, errors: ["Phase 1 — Seed"] };
}
