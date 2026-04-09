/**
 * CODEX·IA — DOF/SIDOF Ingest
 * Connects to SIDOF REST API for legislative reforms
 */

import type { Database } from "sql.js-fts5";
import type { IngestResult } from "./camara-diputados.js";

export async function ingestDofSidof(_db: Database, _since?: string): Promise<IngestResult> {
	console.log("⏳ DOF/SIDOF ingest not yet implemented");
	return { source: "dof_sidof", documentsProcessed: 0, provisionsCreated: 0, errors: ["Phase 2"] };
}
