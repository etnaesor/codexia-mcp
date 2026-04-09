/**
 * CODEX·IA — Master Ingest Script
 * Usage: npm run ingest
 */

import initSqlJs from "sql.js-fts5";
import { readFileSync, writeFileSync, existsSync } from "fs";
import { resolve, dirname } from "path";
import { createRequire } from "module";
import { SCHEMA_SQL } from "../src/db/schema.js";
import { SEED_STATUTES } from "../data/seed.js";

const DB_PATH = resolve(import.meta.dirname ?? ".", "../data/codexia.db");

function loadWasm(): Buffer {
	const require = createRequire(import.meta.url);
	const mainPath = require.resolve("sql.js-fts5");
	return readFileSync(resolve(dirname(mainPath), "sql-wasm.wasm"));
}

async function main() {
	console.log("🏛️  CODEX·IA — Ingest Pipeline");
	console.log(`📦 Database: ${DB_PATH}\n`);

	const SQL = await initSqlJs({ wasmBinary: loadWasm() });
	let db;
	if (existsSync(DB_PATH)) {
		const buffer = readFileSync(DB_PATH);
		db = new SQL.Database(buffer);
	} else {
		db = new SQL.Database();
		db.run(SCHEMA_SQL);
	}

	// Phase 1: Seed data
	console.log("1️⃣  Seed data (constitución, leyes federales)...");

	const existingCount = db.exec("SELECT COUNT(*) FROM statutes");
	const currentCount = (existingCount[0]?.values[0]?.[0] as number) ?? 0;

	if (currentCount > 0) {
		console.log(`   ⏭️  Database already has ${currentCount} statutes. Clearing for fresh seed...`);
		db.run("DELETE FROM provisions");
		db.run("DELETE FROM provisions_fts");
		db.run("DELETE FROM statutes");
		db.run("DELETE FROM sqlite_sequence");
	}

	let totalStatutes = 0;
	let totalProvisions = 0;

	for (const statute of SEED_STATUTES) {
		db.run(
			"INSERT INTO statutes (code, title, jurisdiction, materia, source, source_url, last_reform_date) VALUES (?, ?, ?, ?, ?, ?, ?)",
			[statute.code, statute.title, statute.jurisdiction, statute.materia, statute.source, statute.source_url, statute.last_reform_date]
		);

		const idResult = db.exec("SELECT last_insert_rowid()");
		const statuteId = idResult[0].values[0][0] as number;

		for (const article of statute.articles) {
			db.run(
				"INSERT INTO provisions (statute_id, article_number, title, body, chapter, section) VALUES (?, ?, ?, ?, ?, ?)",
				[statuteId, article.article_number, article.title ?? null, article.body, article.chapter ?? null, article.section ?? null]
			);
			totalProvisions++;
		}

		totalStatutes++;
		console.log(`   ✅ ${statute.code} — ${statute.articles.length} artículos`);
	}

	console.log(`\n📊 Seed complete: ${totalStatutes} leyes, ${totalProvisions} artículos`);

	// Verify FTS5
	console.log("\n2️⃣  Verificando FTS5...");
	const ftsCheck = db.exec("SELECT COUNT(*) FROM provisions_fts");
	const ftsCount = (ftsCheck[0]?.values[0]?.[0] as number) ?? 0;
	console.log(`   ✅ FTS5 index: ${ftsCount} documentos indexados`);

	// Test a search
	const testSearch = db.exec("SELECT snippet(provisions_fts, 2, '**', '**', '...', 16) FROM provisions_fts WHERE provisions_fts MATCH 'trabajador' LIMIT 3");
	if (testSearch.length > 0) {
		console.log(`   ✅ Test search 'trabajador': ${testSearch[0].values.length} resultados`);
	}

	// Update census
	db.run("DELETE FROM census");
	db.run(
		"INSERT INTO census (source, total_documents, indexed_documents) VALUES (?, ?, ?)",
		["seed", totalStatutes, totalProvisions]
	);

	// Save database
	const data = db.export();
	const buffer = Buffer.from(data);
	writeFileSync(DB_PATH, buffer);
	console.log(`\n💾 Saved: ${DB_PATH} (${(buffer.length / 1024).toFixed(1)} KB)`);

	db.close();
	console.log("✅ Done.");
}

main().catch(console.error);
