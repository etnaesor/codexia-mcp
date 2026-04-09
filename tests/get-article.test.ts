/**
 * CODEX·IA — get_article Tool Tests
 */

import { describe, it, expect, beforeAll } from "vitest";
import Database from "better-sqlite3";
import { SCHEMA_SQL } from "../src/db/schema.js";

let db: Database.Database;

beforeAll(() => {
	db = new Database(":memory:");
	db.exec(SCHEMA_SQL);

	db.exec(`
		INSERT INTO statutes (code, title, jurisdiction, materia, source)
		VALUES ('CPEUM', 'Constitución Política de los Estados Unidos Mexicanos', 'federal', 'constitucional', 'test');
	`);
	const id = db.prepare("SELECT last_insert_rowid() AS id").get() as { id: number };
	db.exec(`
		INSERT INTO provisions (statute_id, article_number, title, body)
		VALUES (${id.id}, '1', 'De los Derechos Humanos y sus Garantías',
		'En los Estados Unidos Mexicanos todas las personas gozarán de los derechos humanos reconocidos en esta Constitución y en los tratados internacionales de los que el Estado Mexicano sea parte.');
	`);
});

describe("get_article", () => {
	it("should return verbatim text for a valid article", () => {
		const row = db.prepare(`
			SELECT p.body, s.code
			FROM provisions p
			JOIN statutes s ON s.id = p.statute_id
			WHERE UPPER(s.code) = 'CPEUM' AND p.article_number = '1'
		`).get() as { body: string; code: string } | undefined;

		expect(row).toBeDefined();
		expect(row!.code).toBe("CPEUM");
		expect(row!.body).toContain("derechos humanos");
	});

	it("should return undefined for non-existent article", () => {
		const row = db.prepare(`
			SELECT p.body FROM provisions p
			JOIN statutes s ON s.id = p.statute_id
			WHERE UPPER(s.code) = 'CPEUM' AND p.article_number = '9999'
		`).get();

		expect(row).toBeUndefined();
	});

	it("should be case-insensitive on statute code", () => {
		const row = db.prepare(`
			SELECT p.body FROM provisions p
			JOIN statutes s ON s.id = p.statute_id
			WHERE UPPER(s.code) = UPPER('cpeum') AND p.article_number = '1'
		`).get();

		expect(row).toBeDefined();
	});
});
