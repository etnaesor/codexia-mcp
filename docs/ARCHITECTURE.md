# CODEX·IA — Architecture

## Overview

CODEX·IA follows the Ansvar Systems pattern, proven across 80+ jurisdictions worldwide:

```
Capa 1: Fuentes oficiales mexicanas (8 portales)
    ↓
Capa 2: Pipeline de ingestión (scrapers → parser → SQLite FTS5)
    ↓
Capa 3: MCP Server (4 tools via Model Context Protocol)
    ↓
Capa 4: Consumidores (Claude, Cursor, CORPUSIA RAG, npm público)
```

## Stack

| Component | Technology |
|-----------|-----------|
| Language | TypeScript (ES2022, ESNext modules) |
| Database | SQLite + FTS5 (via better-sqlite3) |
| Search | FTS5 snippet() with unicode61 tokenizer |
| Protocol | MCP SDK (@modelcontextprotocol/sdk) |
| Validation | Zod schemas |
| Deploy | Vercel serverless (< 250 MB limit) |
| CI/CD | GitHub Actions (daily drift detection) |
| License | Apache 2.0 (fork of Ansvar pattern) |

## Pipeline Detail

### Ingest (npm run ingest)

1. **Download**: Fetch raw data from official sources (ZIP, API, scraping)
2. **Decode**: Convert ISO-8859-1 → UTF-8 (Cámara de Diputados)
3. **Parse**: Extract individual articles as atomic provisions
4. **Normalize**: Map to unified schema (statute → provisions)
5. **Index**: Insert into SQLite and rebuild FTS5 virtual table

### Build DB (npm run build:db)

Creates empty database with schema (statutes, provisions, provisions_fts, reforms, census tables).

### Drift Detection (npm run drift:detect)

1. Query SIDOF API for recent DOF publications
2. Match against local statutes by code/title
3. Flag new reforms in `reforms` table
4. In CI mode, exit code 1 if pending reforms > 0

## Data Flow

```
User asks Claude: "¿Qué dice el Art. 123 constitucional?"
    → Claude calls search_law("artículo 123 constitucional")
    → SQLite FTS5 returns matching provisions in <100ms
    → Claude calls get_article("CPEUM", "123")
    → SQLite returns verbatim text of Art. 123
    → Claude presents the EXACT text to user (no paraphrasing)
```

## Dual-Use Architecture

CODEX·IA serves two audiences simultaneously:

1. **Internal**: Feeds CORPUSIA's RAG anti-hallucination pipeline (Creator→Critic pattern). The Critic agent uses get_article() to verify every legal citation the Creator generates.

2. **External**: Published as @corpusia/codexia-mcp on npm. Any developer worldwide can install it and give their AI direct access to Mexican law.
