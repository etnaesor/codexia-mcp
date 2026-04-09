/**
 * CODEX·IA — list_statutes Tool Tests (sql.js-fts5)
 */

import { describe, it, expect, beforeAll } from "vitest";
import initSqlJs, { type Database } from "sql.js-fts5";
import { readFileSync } from "fs";
import { resolve, dirname } from "path";
import { createRequire } from "module";
import { SCHEMA_SQL } from "../src/db/schema.js";
import { queryAll } from "../src/db/query.js";

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
	db.run(`INSERT INTO statutes (code, title, jurisdiction, materia, source)
		VALUES ('LFT', 'Ley Federal del Trabajo', 'federal', 'laboral', 'test')`);
	db.run(`INSERT INTO statutes (code, title, jurisdiction, materia, source)
		VALUES ('CPCDMX', 'Código Penal para el Distrito Federal', 'estatal:cdmx', 'penal', 'test')`);

	db.run(`INSERT INTO provisions (statute_id, article_number, body) VALUES (1, '1', 'Art 1 CPEUM')`);
	db.run(`INSERT INTO provisions (statute_id, article_number, body) VALUES (1, '2', 'Art 2 CPEUM')`);
	db.run(`INSERT INTO provisions (statute_id, article_number, body) VALUES (2, '48', 'Art 48 LFT')`);
});

describe("list_statutes", () => {
	it("should list all statutes without filters", () => {
		const rows = queryAll(db, `
			SELECT code, title, materia, jurisdiction,
				(SELECT COUNT(*) FROM provisions WHERE statute_id = statutes.id) AS article_count
			FROM statutes ORDER BY title LIMIT 25
		`);
		expect(rows.length).toBe(3);
	});

	it("should filter by materia", () => {
		const rows = queryAll(db, `
			SELECT code FROM statutes WHERE materia = ? LIMIT 25
		`, "laboral");
		expect(rows.length).toBe(1);
		expect(rows[0].code).toBe("LFT");
	});

	it("should filter by jurisdiction", () => {
		const rows = queryAll(db, `
			SELECT code FROM statutes WHERE jurisdiction = ? LIMIT 25
		`, "estatal:cdmx");
		expect(rows.length).toBe(1);
		expect(rows[0].code).toBe("CPCDMX");
	});

	it("should count articles per statute", () => {
		const rows = queryAll(db, `
			SELECT code,
				(SELECT COUNT(*) FROM provisions WHERE statute_id = statutes.id) AS article_count
			FROM statutes WHERE code = 'CPEUM'
		`);
		expect(rows[0].article_count).toBe(2);
	});

	it("should return empty for non-existent materia", () => {
		const rows = queryAll(db, `
			SELECT code FROM statutes WHERE materia = ? LIMIT 25
		`, "inexistente");
		expect(rows.length).toBe(0);
	});
});
