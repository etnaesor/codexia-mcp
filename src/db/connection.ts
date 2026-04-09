/**
 * CODEX·IA — SQLite Database Connection (sql.js-fts5 WASM)
 * Pure JavaScript SQLite with FTS5 support — no native compilation.
 */

import initSqlJs, { type Database } from "sql.js-fts5";
import { readFileSync, existsSync } from "fs";
import { resolve, dirname } from "path";
import { createRequire } from "module";

const DEFAULT_DB_PATH = resolve(
	import.meta.dirname ?? ".",
	"../../data/codexia.db"
);

let _db: Database | null = null;
let _sqlPromise: ReturnType<typeof initSqlJs> | null = null;

function getWasmBinary(): Buffer {
	const require = createRequire(import.meta.url);
	const sqlJsFts5Main = require.resolve("sql.js-fts5");
	const wasmPath = resolve(dirname(sqlJsFts5Main), "sql-wasm.wasm");
	return readFileSync(wasmPath);
}

function getSqlJs() {
	if (!_sqlPromise) {
		const wasmBinary = getWasmBinary();
		_sqlPromise = initSqlJs({ wasmBinary });
	}
	return _sqlPromise;
}

export async function getDb(dbPath?: string): Promise<Database> {
	if (_db) return _db;

	const path = dbPath ?? process.env.DB_PATH ?? DEFAULT_DB_PATH;
	const SQL = await getSqlJs();

	if (existsSync(path)) {
		const buffer = readFileSync(path);
		_db = new SQL.Database(buffer);
	} else {
		_db = new SQL.Database();
	}
	return _db;
}

export function closeDb(): void {
	if (_db) { _db.close(); _db = null; }
}

export { type Database } from "sql.js-fts5";
