/**
 * CODEX·IA — search_law Tool Tests
 */

import { describe, it, expect, beforeAll } from "vitest";
import Database from "better-sqlite3";
import { SCHEMA_SQL } from "../src/db/schema.js";

let db: Database.Database;

beforeAll(() => {
	db = new Database(":memory:");
	db.exec(SCHEMA_SQL);

	// Seed test data
	db.exec(`
		INSERT INTO statutes (code, title, jurisdiction, materia, source)
		VALUES ('LFT', 'Ley Federal del Trabajo', 'federal', 'laboral', 'test');
	`);
	const statuteId = db.prepare("SELECT last_insert_rowid() AS id").get() as { id: number };
	db.exec(`
		INSERT INTO provisions (statute_id, article_number, body)
		VALUES (${statuteId.id}, '48', 'El trabajador podrá solicitar ante la Junta de Conciliación y Arbitraje, a su elección, que se le reinstale en el trabajo que desempeñaba, o que se le indemnice con el importe de tres meses de salario.');
	`);
});

describe("search_law", () => {
	it("should find provisions by keyword via FTS5", () => {
		const results = db.prepare(`
			SELECT p.article_number, snippet(provisions_fts, 2, '<b>', '</b>', '...', 16) AS snippet
			FROM provisions_fts
			JOIN provisions p ON p.id = provisions_fts.rowid
			WHERE provisions_fts MATCH 'trabajador'
		`).all();

		expect(results.length).toBeGreaterThan(0);
		expect((results[0] as any).article_number).toBe("48");
	});

	it("should return empty for non-matching query", () => {
		const results = db.prepare(`
			SELECT * FROM provisions_fts WHERE provisions_fts MATCH 'xyznonexistent'
		`).all();

		expect(results.length).toBe(0);
	});

	it("should support FTS5 boolean operators", () => {
		const results = db.prepare(`
			SELECT * FROM provisions_fts WHERE provisions_fts MATCH 'trabajador AND salario'
		`).all();

		expect(results.length).toBeGreaterThan(0);
	});
});
