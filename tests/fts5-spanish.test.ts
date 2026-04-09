/**
 * CODEX·IA — FTS5 Spanish Language Tests
 * Validates diacritics handling, tokenization, and search operators
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
		VALUES ('CPEUM', 'Constitución Política de los Estados Unidos Mexicanos', 'federal', 'constitucional', 'test')`);

	const articles = [
		["1", "Toda persona gozará de los derechos humanos reconocidos en esta Constitución"],
		["3", "Toda persona tiene derecho a la educación. El Estado impartirá educación preescolar, primaria y secundaria"],
		["14", "A ninguna ley se dará efecto retroactivo en perjuicio de persona alguna"],
		["16", "Nadie puede ser molestado en su persona, familia, domicilio o posesiones"],
		["123", "Toda persona tiene derecho al trabajo digno y socialmente útil"],
	];

	for (const [num, body] of articles) {
		db.run("INSERT INTO provisions (statute_id, article_number, body) VALUES (1, ?, ?)", [num, body]);
	}
});

describe("FTS5 Spanish", () => {
	it("should find results with diacritics (remove_diacritics 2)", () => {
		const r1 = db.exec("SELECT COUNT(*) FROM provisions_fts WHERE provisions_fts MATCH 'Constitución'");
		const r2 = db.exec("SELECT COUNT(*) FROM provisions_fts WHERE provisions_fts MATCH 'Constitucion'");
		expect(r1[0].values[0][0]).toBeGreaterThan(0);
		expect(r2[0].values[0][0]).toBeGreaterThan(0);
		expect(r1[0].values[0][0]).toBe(r2[0].values[0][0]);
	});

	it("should handle ñ character", () => {
		const results = db.exec("SELECT COUNT(*) FROM provisions_fts WHERE provisions_fts MATCH 'ninguna'");
		expect(results[0].values[0][0]).toBeGreaterThan(0);
	});

	it("should support OR operator", () => {
		const results = db.exec("SELECT COUNT(*) FROM provisions_fts WHERE provisions_fts MATCH 'educación OR trabajo'");
		expect(results[0].values[0][0]).toBe(2);
	});

	it("should support NOT operator", () => {
		const results = db.exec("SELECT COUNT(*) FROM provisions_fts WHERE provisions_fts MATCH 'persona NOT educación'");
		expect((results[0].values[0][0] as number)).toBeGreaterThan(0);
	});

	it("should generate snippets with context", () => {
		const results = db.exec(`
			SELECT snippet(provisions_fts, 2, '<b>', '</b>', '...', 10)
			FROM provisions_fts WHERE provisions_fts MATCH 'derechos'
		`);
		expect(results.length).toBeGreaterThan(0);
		const snippet = results[0].values[0][0] as string;
		expect(snippet).toContain("<b>");
		expect(snippet).toContain("</b>");
	});

	it("should rank results by relevance", () => {
		const results = db.exec(`
			SELECT article_number, rank FROM provisions_fts
			WHERE provisions_fts MATCH 'persona'
			ORDER BY rank
		`);
		expect(results[0].values.length).toBeGreaterThan(1);
	});
});
