/**
 * CODEX·IA — Coverage Census Script
 * Usage: npm run census
 */

import initSqlJs from "sql.js-fts5";
import { readFileSync, existsSync } from "fs";
import { resolve, dirname } from "path";
import { createRequire } from "module";

const DB_PATH = resolve(import.meta.dirname ?? ".", "../data/codexia.db");

function loadWasm(): Buffer {
	const require = createRequire(import.meta.url);
	const mainPath = require.resolve("sql.js-fts5");
	return readFileSync(resolve(dirname(mainPath), "sql-wasm.wasm"));
}

async function main() {
	if (!existsSync(DB_PATH)) {
		console.log("❌ Database not found. Run 'npm run build:db' first.");
		process.exit(1);
	}

	const SQL = await initSqlJs({ wasmBinary: loadWasm() });
	const db = new SQL.Database(readFileSync(DB_PATH));

	console.log("🏛️  CODEX·IA — Coverage Census\n");

	const bySource = db.exec("SELECT source, COUNT(*) AS c FROM statutes GROUP BY source ORDER BY c DESC");
	if (bySource.length > 0) {
		console.log("📂 By Source:");
		for (const row of bySource[0].values) console.log(`   ${row[0]}: ${row[1]} statutes`);
	}

	const byMateria = db.exec("SELECT materia, COUNT(*) AS c FROM statutes WHERE materia IS NOT NULL GROUP BY materia ORDER BY c DESC");
	if (byMateria.length > 0) {
		console.log("\n⚖️  By Materia:");
		for (const row of byMateria[0].values) console.log(`   ${row[0]}: ${row[1]}`);
	}

	const total = db.exec("SELECT (SELECT COUNT(*) FROM statutes), (SELECT COUNT(*) FROM provisions)");
	const [s, p] = (total[0]?.values[0] ?? [0, 0]) as number[];
	console.log(`\n📊 Total: ${s} statutes, ${p} provisions`);
	console.log(`🎯 Target: 59,000 documents`);
	console.log(`📈 Coverage: ${((p / 59000) * 100).toFixed(1)}%`);

	db.close();
}

main().catch(console.error);
