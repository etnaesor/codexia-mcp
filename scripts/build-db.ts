/**
 * CODEX·IA — Build Database Script
 * Usage: npm run build:db
 * Creates empty SQLite database with FTS5 schema
 */

import Database from "better-sqlite3";
import { resolve } from "path";
import { mkdirSync } from "fs";
import { SCHEMA_SQL } from "../src/db/schema.js";

const DB_PATH = resolve(import.meta.dirname ?? ".", "../data/codexia.db");

console.log("🏛️  CODEX·IA — Build Database");
console.log(`📦 Creating: ${DB_PATH}\n`);

mkdirSync(resolve(DB_PATH, ".."), { recursive: true });

const db = new Database(DB_PATH);
db.pragma("journal_mode = WAL");
db.exec(SCHEMA_SQL);

const tables = db.prepare("SELECT name FROM sqlite_master WHERE type='table'").all();
console.log(`✅ Created ${tables.length} tables:`);
for (const t of tables as Array<{ name: string }>) {
	console.log(`   • ${t.name}`);
}

db.close();
console.log("\n✅ Database ready. Run 'npm run ingest' to populate.");
