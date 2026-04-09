/**
 * CODEX·IA — Drift Detection Script
 * Usage: npm run drift:detect
 * Compares local DB against DOF for legislative reforms
 * Runs daily via GitHub Actions CI/CD
 */

import Database from "better-sqlite3";
import { resolve } from "path";

const DB_PATH = resolve(import.meta.dirname ?? ".", "../data/codexia.db");
const isCI = process.argv.includes("--ci");

async function main() {
	console.log("🏛️  CODEX·IA — Drift Detection");
	console.log(`📦 Database: ${DB_PATH}`);
	console.log(`🔄 Mode: ${isCI ? "CI/CD" : "manual"}\n`);

	const db = new Database(DB_PATH, { readonly: true });

	// Count current coverage
	const stats = db.prepare(`
		SELECT
			(SELECT COUNT(*) FROM statutes) AS statutes,
			(SELECT COUNT(*) FROM provisions) AS provisions,
			(SELECT COUNT(*) FROM reforms WHERE applied = 0) AS pending_reforms
	`).get() as { statutes: number; provisions: number; pending_reforms: number };

	console.log(`📊 Current coverage:`);
	console.log(`   Statutes:  ${stats.statutes}`);
	console.log(`   Provisions: ${stats.provisions}`);
	console.log(`   Pending reforms: ${stats.pending_reforms}`);

	// TODO: Query SIDOF API for recent DOF publications
	// Compare against local reforms table
	// Flag new reforms as pending
	// In CI mode, exit with code 1 if pending reforms > threshold

	console.log("\n⏳ SIDOF drift check not yet implemented");

	db.close();

	if (isCI && stats.pending_reforms > 0) {
		console.log(`\n⚠️  ${stats.pending_reforms} pending reforms — DB may be outdated`);
		process.exit(1);
	}

	console.log("\n✅ Drift detection complete.");
}

main().catch((err) => {
	console.error("❌ Drift detection failed:", err);
	process.exit(1);
});
