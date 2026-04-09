/**
 * CODEX·IA — get_article Tool Tests (sql.js-fts5)
 */

import { describe, it, expect, beforeAll } from "vitest";
import initSqlJs, { type Database } from "sql.js-fts5";
import { readFileSync } from "fs";
import { resolve, dirname } from "path";
import { createRequire } from "module";
import { SCHEMA_SQL } from "../src/db/schema.js";
import { queryOne } from "../src/db/query.js";

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
	db.run(`INSERT INTO provisions (statute_id, article_number, title, body)
		VALUES (1, '1', 'De los Derechos Humanos', 'En los Estados Unidos Mexicanos todas las personas gozarán de los derechos humanos reconocidos en esta Constitución.')`);
});

describe("get_article", () => {
	it("should return verbatim text for a valid article", () => {
		const row = queryOne(db, `
			SELECT p.body, s.code FROM provisions p
			JOIN statutes s ON s.id = p.statute_id
			WHERE UPPER(s.code) = 'CPEUM' AND p.article_number = '1'
		`);
		expect(row).toBeDefined();
		expect(row!.code).toBe("CPEUM");
		expect((row!.body as string)).toContain("derechos humanos");
	});

	it("should return undefined for non-existent article", () => {
		const row = queryOne(db, `
			SELECT p.body FROM provisions p
			JOIN statutes s ON s.id = p.statute_id
			WHERE UPPER(s.code) = 'CPEUM' AND p.article_number = '9999'
		`);
		expect(row).toBeUndefined();
	});

	it("should be case-insensitive on statute code", () => {
		const row = queryOne(db, `
			SELECT p.body FROM provisions p
			JOIN statutes s ON s.id = p.statute_id
			WHERE UPPER(s.code) = UPPER('cpeum') AND p.article_number = '1'
		`);
		expect(row).toBeDefined();
	});
});
