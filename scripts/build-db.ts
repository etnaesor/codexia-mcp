/**
 * CODEX·IA — Build Database Script
 * Usage: npm run build:db
 * Creates SQLite database with FTS5 schema and saves to disk
 */

import initSqlJs from "sql.js-fts5";
import { readFileSync, writeFileSync, mkdirSync } from "fs";
import { resolve, dirname } from "path";
import { createRequire } from "module";
import { SCHEMA_SQL } from "../src/db/schema.js";

const DB_PATH = resolve(import.meta.dirname ?? ".", "../data/codexia.db");

function loadWasm(): Buffer {
	const require = createRequire(import.meta.url);
	const mainPath = require.resolve("sql.js-fts5");
	return readFileSync(resolve(dirname(mainPath), "sql-wasm.wasm"));
}

async function main() {
	console.log("🏛️  CODEX·IA — Build Database");
	console.log(`📦 Creating: ${DB_PATH}\n`);

	mkdirSync(dirname(DB_PATH), { recursive: true });

	const SQL = await initSqlJs({ wasmBinary: loadWasm() });
	const db = new SQL.Database();
	db.run(SCHEMA_SQL);

	const tables = db.exec("SELECT name FROM sqlite_master WHERE type='table'");
	if (tables.length > 0) {
		console.log(`✅ Created ${tables[0].values.length} tables:`);
		for (const row of tables[0].values) {
			console.log(`   • ${row[0]}`);
		}
	}

	// Save to disk
	const data = db.export();
	const buffer = Buffer.from(data);
	writeFileSync(DB_PATH, buffer);
	console.log(`\n💾 Saved: ${DB_PATH} (${(buffer.length / 1024).toFixed(1)} KB)`);

	db.close();
	console.log("✅ Database ready. Run 'npm run ingest' to populate.");
}

main().catch(console.error);
