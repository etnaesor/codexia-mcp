# CODEX·IA — Changelog

All notable changes to this project will be documented in this file.

## [0.1.0] — 2026-04-09

### Added
- Initial project structure (TypeScript + SQLite FTS5 + MCP SDK)
- 4 MCP tools: search_law, get_article, list_statutes, check_updates
- Database schema with FTS5 virtual table for Spanish full-text search
- Ingest pipeline stubs for 8 Mexican government data sources
- Scripts: ingest, build:db, drift:detect, census
- GitHub Actions workflow for daily drift detection
- Landing page (HTML, responsive, on-brand)
- Complete marketing kit (6 MCP registries, 5 social platforms, 3 LegalTech outlets)
- Documentation: README, TOOLS.md, COVERAGE.md, ARCHITECTURE, BRAND-GUIDE, DEPLOYMENT, SOURCES
- Test suite (Vitest) for search_law and get_article
- Apache 2.0 license

### Coming Next
- Phase 1: Seed with CORPUSIA acervo (1,063 documents)
- Phase 1: Cámara de Diputados federal law ingest
- npm publish as @corpusia/codexia-mcp
- Vercel deployment at codexia.corpusia.net/mcp
