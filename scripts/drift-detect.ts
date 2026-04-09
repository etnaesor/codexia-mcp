/**
 * CODEX·IA — Drift Detection Script
 * Usage: npm run drift:detect
 */

import initSqlJs from "sql.js-fts5";
import { readFileSync, existsSync } from "fs";
import { resolve, dirname } from "path";
import { createRequire } from "module";

const DB_PATH = resolve(import.meta.dirname ?? ".", "../data/codexia.db");
const isCI = process.argv.includes("--ci");

function loadWasm(): Buffer {
	const require = createRequire(import.meta.url);
	const mainPath = require.resolve("sql.js-fts5");
	return readFileSync(resolve(dirname(mainPath), "sql-wasm.wasm"));
}

async function main() {
	console.log("🏛️  CODEX·IA — Drift Detection");
	console.log(`📦 Database: ${DB_PATH}`);
	console.log(`🔄 Mode: ${isCI ? "CI/CD" : "manual"}\n`);

	if (!existsSync(DB_PATH)) {
		console.log("❌ Database not found. Run 'npm run build:db' first.");
		process.exit(1);
	}

	const SQL = await initSqlJs({ wasmBinary: loadWasm() });
	const buffer = readFileSync(DB_PATH);
	const db = new SQL.Database(buffer);

	const result = db.exec(`
		SELECT
			(SELECT COUNT(*) FROM statutes) AS statutes,
			(SELECT COUNT(*) FROM provisions) AS provisions,
			(SELECT COUNT(*) FROM reforms WHERE applied = 0) AS pending
	`);

	const row = result[0]?.values[0] ?? [0, 0, 0];
	const [statutes, provisions, pending] = row as number[];

	console.log("📊 Current coverage:");
	console.log(`   Statutes:  ${statutes}`);
	console.log(`   Provisions: ${provisions}`);
	console.log(`   Pending reforms: ${pending}`);
	console.log("\n⏳ SIDOF drift check not yet implemented");

	db.close();

	if (isCI && pending > 0) {
		console.log(`\n⚠️  ${pending} pending reforms`);
		process.exit(1);
	}
	console.log("\n✅ Drift detection complete.");
}

main().catch((err) => { console.error("❌", err); process.exit(1); });
