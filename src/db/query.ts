/**
 * CODEX·IA — SQLite Query Helper
 * Wraps sql.js-fts5 with a simpler query API
 */

import type { Database } from "sql.js-fts5";

export interface QueryResult {
	[key: string]: string | number | null;
}

export function queryAll(db: Database, sql: string, ...params: (string | number)[]): QueryResult[] {
	const stmt = db.prepare(sql);
	if (params.length > 0) stmt.bind(params);
	const results: QueryResult[] = [];
	const columns = stmt.getColumnNames();
	while (stmt.step()) {
		const values = stmt.get();
		const row: QueryResult = {};
		for (let i = 0; i < columns.length; i++) {
			row[columns[i]] = values[i] as string | number | null;
		}
		results.push(row);
	}
	stmt.free();
	return results;
}

export function queryOne(db: Database, sql: string, ...params: (string | number)[]): QueryResult | undefined {
	return queryAll(db, sql, ...params)[0];
}

export function exec(db: Database, sql: string): void {
	db.run(sql);
}
