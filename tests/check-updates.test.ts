/**
 * CODEX·IA — check_updates Tool Tests (sql.js-fts5)
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
		VALUES ('LFT', 'Ley Federal del Trabajo', 'federal', 'laboral', 'test')`);

	db.run(`INSERT INTO reforms (statute_id, dof_date, summary, applied)
		VALUES (1, '2024-06-12', 'Reforma al artículo 48 sobre indemnización', 1)`);
	db.run(`INSERT INTO reforms (statute_id, dof_date, summary, applied)
		VALUES (1, '2024-11-01', 'Reforma laboral pendiente de aplicar', 0)`);
});

describe("check_updates", () => {
	it("should find reforms since a date", () => {
		const rows = queryAll(db, `
			SELECT r.dof_date, r.summary, r.applied, s.code
			FROM reforms r JOIN statutes s ON s.id = r.statute_id
			WHERE r.dof_date >= ?
			ORDER BY r.dof_date DESC
		`, "2024-01-01");
		expect(rows.length).toBe(2);
	});

	it("should identify pending reforms", () => {
		const rows = queryAll(db, `
			SELECT COUNT(*) AS pending
			FROM reforms WHERE applied = 0
		`);
		expect(rows[0].pending).toBe(1);
	});

	it("should filter by statute code", () => {
		const rows = queryAll(db, `
			SELECT r.dof_date FROM reforms r
			JOIN statutes s ON s.id = r.statute_id
			WHERE UPPER(s.code) = UPPER(?) AND r.dof_date >= ?
		`, "LFT", "2024-01-01");
		expect(rows.length).toBe(2);
	});

	it("should return empty for future date filter", () => {
		const rows = queryAll(db, `
			SELECT r.dof_date FROM reforms r
			WHERE r.dof_date >= ?
		`, "2099-01-01");
		expect(rows.length).toBe(0);
	});
});
