/**
 * CODEX·IA — search_law Tool Tests (sql.js-fts5)
 */

import { describe, it, expect, beforeAll } from "vitest";
import initSqlJs, { type Database } from "sql.js-fts5";
import { readFileSync } from "fs";
import { resolve, dirname } from "path";
import { createRequire } from "module";
import { SCHEMA_SQL } from "../src/db/schema.js";

function loadWasm(): Buffer {
	const require = createRequire(import.meta.url);
	const mainPath = require.resolve("sql.js-fts5");
	return readFileSync(resolve(dirname(mainPath), "sql-wasm.wasm"));
}

let db: Database;

beforeAll(async () => {
	const SQL = await initSqlJs({ wasmBinary: loadWasm() });
	db = new SQL.Database();
	db.run(SCHEMA_SQL);

	db.run(`INSERT INTO statutes (code, title, jurisdiction, materia, source)
		VALUES ('LFT', 'Ley Federal del Trabajo', 'federal', 'laboral', 'test')`);
	db.run(`INSERT INTO provisions (statute_id, article_number, body)
		VALUES (1, '48', 'El trabajador podrá solicitar ante la Junta de Conciliación y Arbitraje, a su elección, que se le reinstale en el trabajo que desempeñaba, o que se le indemnice con el importe de tres meses de salario.')`);
});

describe("search_law", () => {
	it("should find provisions by keyword via FTS5", () => {
		const results = db.exec(`
			SELECT p.article_number
			FROM provisions_fts
			JOIN provisions p ON p.id = provisions_fts.rowid
			WHERE provisions_fts MATCH 'trabajador'
		`);
		expect(results.length).toBeGreaterThan(0);
		expect(results[0].values[0][0]).toBe("48");
	});

	it("should return empty for non-matching query", () => {
		const results = db.exec("SELECT * FROM provisions_fts WHERE provisions_fts MATCH 'xyznonexistent'");
		expect(results.length).toBe(0);
	});

	it("should support FTS5 AND operator", () => {
		const results = db.exec("SELECT * FROM provisions_fts WHERE provisions_fts MATCH 'trabajador AND salario'");
		expect(results.length).toBeGreaterThan(0);
	});
});
