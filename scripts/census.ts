/**
 * CODEX·IA — Coverage Census Script
 * Usage: npm run census
 * Reports coverage stats per source and materia
 */

import Database from "better-sqlite3";
import { resolve } from "path";

const DB_PATH = resolve(import.meta.dirname ?? ".", "../data/codexia.db");

const db = new Database(DB_PATH, { readonly: true });

console.log("🏛️  CODEX·IA — Coverage Census\n");

const bySource = db.prepare(`
	SELECT source, COUNT(*) AS count FROM statutes GROUP BY source ORDER BY count DESC
`).all() as Array<{ source: string; count: number }>;

console.log("📂 By Source:");
for (const r of bySource) console.log(`   ${r.source}: ${r.count} statutes`);

const byMateria = db.prepare(`
	SELECT materia, COUNT(*) AS count FROM statutes WHERE materia IS NOT NULL GROUP BY materia ORDER BY count DESC
`).all() as Array<{ materia: string; count: number }>;

console.log("\n⚖️  By Materia:");
for (const r of byMateria) console.log(`   ${r.materia}: ${r.count}`);

const total = db.prepare(`
	SELECT
		(SELECT COUNT(*) FROM statutes) AS statutes,
		(SELECT COUNT(*) FROM provisions) AS provisions
`).get() as { statutes: number; provisions: number };

console.log(`\n📊 Total: ${total.statutes} statutes, ${total.provisions} provisions`);
console.log(`🎯 Target: 59,000 documents across 34 branches of Mexican law`);
console.log(`📈 Coverage: ${((total.provisions / 59000) * 100).toFixed(1)}%`);

db.close();
