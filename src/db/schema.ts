/**
 * CODEX·IA — Database Schema
 * SQLite FTS5 schema for Mexican legislation
 */

export const SCHEMA_SQL = `
-- Core legislation table
CREATE TABLE IF NOT EXISTS statutes (
	id INTEGER PRIMARY KEY AUTOINCREMENT,
	code TEXT NOT NULL,           -- e.g. "CPEUM", "LFT", "CCF"
	title TEXT NOT NULL,          -- Full name of the statute
	jurisdiction TEXT NOT NULL,   -- "federal", "estatal:jalisco", etc.
	materia TEXT,                 -- "laboral", "civil", "penal", etc.
	source TEXT NOT NULL,         -- "camara_diputados", "dof", "scjn"
	source_url TEXT,
	last_reform_date TEXT,
	ingested_at TEXT DEFAULT (datetime('now'))
);

-- Individual articles/provisions
CREATE TABLE IF NOT EXISTS provisions (
	id INTEGER PRIMARY KEY AUTOINCREMENT,
	statute_id INTEGER NOT NULL,
	article_number TEXT NOT NULL,
	title TEXT,
	body TEXT NOT NULL,
	chapter TEXT,
	section TEXT,
	effective_date TEXT,
	FOREIGN KEY (statute_id) REFERENCES statutes(id)
);

-- FTS5 virtual table for full-text search in Spanish
CREATE VIRTUAL TABLE IF NOT EXISTS provisions_fts USING fts5(
	article_number,
	title,
	body,
	content='provisions',
	content_rowid='id',
	tokenize='unicode61 remove_diacritics 2'
);

-- Triggers to keep FTS5 in sync
CREATE TRIGGER IF NOT EXISTS provisions_ai AFTER INSERT ON provisions BEGIN
	INSERT INTO provisions_fts(rowid, article_number, title, body)
	VALUES (new.id, new.article_number, new.title, new.body);
END;

-- Drift detection: track DOF reforms
CREATE TABLE IF NOT EXISTS reforms (
	id INTEGER PRIMARY KEY AUTOINCREMENT,
	statute_id INTEGER,
	dof_date TEXT NOT NULL,
	dof_url TEXT,
	summary TEXT,
	detected_at TEXT DEFAULT (datetime('now')),
	applied INTEGER DEFAULT 0
);

-- Coverage census
CREATE TABLE IF NOT EXISTS census (
	id INTEGER PRIMARY KEY AUTOINCREMENT,
	source TEXT NOT NULL,
	total_documents INTEGER,
	indexed_documents INTEGER,
	last_checked TEXT DEFAULT (datetime('now'))
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_statutes_code ON statutes(code);
CREATE INDEX IF NOT EXISTS idx_statutes_materia ON statutes(materia);
CREATE INDEX IF NOT EXISTS idx_statutes_jurisdiction ON statutes(jurisdiction);
CREATE INDEX IF NOT EXISTS idx_provisions_statute ON provisions(statute_id);
CREATE INDEX IF NOT EXISTS idx_provisions_article ON provisions(article_number);
CREATE INDEX IF NOT EXISTS idx_reforms_statute ON reforms(statute_id);
`;
