declare module "sql.js-fts5" {
	interface QueryExecResult {
		columns: string[];
		values: (string | number | null | Uint8Array)[][];
	}

	interface Statement {
		bind(params?: (string | number | null)[]): boolean;
		step(): boolean;
		get(): (string | number | null | Uint8Array)[];
		getColumnNames(): string[];
		free(): boolean;
		reset(): void;
	}

	class Database {
		constructor(data?: ArrayLike<number> | Buffer | null);
		run(sql: string, params?: (string | number | null)[]): Database;
		exec(sql: string, params?: (string | number | null)[]): QueryExecResult[];
		prepare(sql: string): Statement;
		export(): Uint8Array;
		close(): void;
	}

	interface SqlJsConfig {
		locateFile?: (filename: string) => string;
		wasmBinary?: ArrayLike<number> | Buffer;
	}

	interface SqlJsStatic {
		Database: typeof Database;
	}

	export default function initSqlJs(config?: SqlJsConfig): Promise<SqlJsStatic>;
	export { Database, Statement, QueryExecResult, SqlJsStatic, SqlJsConfig };
}
