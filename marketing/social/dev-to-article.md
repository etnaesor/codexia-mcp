# Dev.to — Technical Article
# URL: https://dev.to/new

## Title
Building CODEX·IA: How we turned Mexico's fragmented legal system into an MCP server

## Tags
mcp, legaltech, typescript, sqlite, opensource

## Cover Image Alt
CODEX·IA Mexican Law MCP Server architecture diagram

## Article Body

---

Mexico has over 59,000 legal documents spread across 8 government portals. None of them have an API. The Cámara de Diputados serves legislation as HTML files inside ZIP archives encoded in ISO-8859-1. The SCJN's search engine is a JavaScript SPA that requires Playwright to scrape. The DOF has undocumented JSON endpoints that nobody knows about.

We needed all of this inside our AI platform ([CORPUSIA](https://corpusia.net)) because our legal document generation agents kept hallucinating citations. The fix wasn't prompt engineering — it was building proper data infrastructure.

## The Ansvar Pattern

We based CODEX·IA on the architecture pioneered by [Ansvar Systems](https://github.com/Ansvar-Systems), who've built identical MCP servers for 80+ jurisdictions (US, EU, Germany, Spain, South Korea, etc.). The pattern is elegant:

```
Official Sources → Scrapers/APIs → Provision Parser → SQLite FTS5 → MCP Tools
```

Each law gets broken down into article-level "provisions" — the atomic unit of legal text. These go into SQLite with an FTS5 virtual table optimized for Spanish (`tokenize='unicode61 remove_diacritics 2'`). The result: sub-100ms full-text search across the entire Mexican legal corpus.

## The 4 MCP Tools

CODEX·IA exposes four tools via Model Context Protocol:

**search_law** — Full-text search using FTS5 snippet(). Returns articles matching your query with highlighted context.

**get_article** — The most important tool. Returns the verbatim text of a specific article. No LLM summarization, no paraphrasing. `get_article("LFT", "48")` returns exactly what Article 48 of the Federal Labor Law says.

**list_statutes** — Browse the catalog filtered by legal branch (laboral, civil, penal, fiscal) and jurisdiction (federal vs. state).

**check_updates** — Drift detection. Queries the DOF (Diario Oficial de la Federación) to detect legislative reforms that might have changed articles in your database.

## Why Verbatim Matters

Stanford research found that even the best legal AI tools hallucinate at 8-17%. Lexis+ AI: 17%. Westlaw: 33% (later improved to 8%). These are billion-dollar products.

CODEX·IA's `get_article()` has a 0% hallucination rate by design — it returns text directly from the database, which was ingested directly from official government sources. The LLM never touches the statutory text.

## Try It

```bash
npm install @corpusia/codexia-mcp
```

GitHub: [etnaesor/codexia-mcp](https://github.com/etnaesor/codexia-mcp)
Web: [codexia.mx](https://codexia.mx)
