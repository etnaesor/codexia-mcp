/**
 * CODEX·IA — Master Ingest Script
 * Usage: npm run ingest
 * Runs all ingest pipelines in sequence
 */

import Database from "better-sqlite3";
import { resolve } from "path";
import { SCHEMA_SQL } from "../src/db/schema.js";
import { ingestCorpusiaAcervo } from "../src/ingest/corpusia-acervo.js";
import { ingestCamaraDiputados } from "../src/ingest/camara-diputados.js";
import { ingestDofSidof } from "../src/ingest/dof-sidof.js";
import { ingestScjnSjf } from "../src/ingest/scjn-sjf.js";

const DB_PATH = resolve(import.meta.dirname ?? ".", "../data/codexia.db");

async function main() {
	console.log("🏛️  CODEX·IA — Ingest Pipeline");
	console.log(`📦 Database: ${DB_PATH}\n`);

	const db = new Database(DB_PATH);
	db.pragma("journal_mode = WAL");
	db.exec(SCHEMA_SQL);

	const results = [];

	// Phase 1: Seed with CORPUSIA acervo
	console.log("1️⃣  CORPUSIA Acervo (seed)...");
	results.push(await ingestCorpusiaAcervo(db));

	// Phase 1: Cámara de Diputados
	console.log("2️⃣  Cámara de Diputados...");
	results.push(await ingestCamaraDiputados(db));

	// Phase 2: DOF/SIDOF reforms
	console.log("3️⃣  DOF/SIDOF...");
	results.push(await ingestDofSidof(db));

	// Phase 2: SCJN jurisprudence
	console.log("4️⃣  SCJN/SJF...");
	results.push(await ingestScjnSjf(db));

	// Summary
	console.log("\n📊 Ingest Summary:");
	for (const r of results) {
		const status = r.errors.length > 0 ? "⚠️" : "✅";
		console.log(`  ${status} ${r.source}: ${r.documentsProcessed} docs, ${r.provisionsCreated} provisions`);
	}

	db.close();
	console.log("\n✅ Done.");
}

main().catch(console.error);
