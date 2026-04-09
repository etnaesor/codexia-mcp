/**
 * CODEX·IA — SQLite FTS5 Database Connection
 * Manages the connection to the legislation database
 */

import Database from "better-sqlite3";
import { resolve } from "path";
import { existsSync } from "fs";

const DEFAULT_DB_PATH = resolve(
	import.meta.dirname ?? ".",
	"../../data/codexia.db"
);

let _db: Database.Database | null = null;

export function getDb(dbPath?: string): Database.Database {
	if (_db) return _db;

	const path = dbPath ?? process.env.DB_PATH ?? DEFAULT_DB_PATH;

	if (!existsSync(path)) {
		throw new Error(
			`Database not found at ${path}. Run 'npm run build:db' first.`
		);
	}

	_db = new Database(path, { readonly: true });
	_db.pragma("journal_mode = WAL");
	_db.pragma("cache_size = -64000"); // 64MB cache
	_db.pragma("mmap_size = 268435456"); // 256MB mmap

	return _db;
}

export function closeDb(): void {
	if (_db) {
		_db.close();
		_db = null;
	}
}
