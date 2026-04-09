# MCP Registry Official — Submission
# URL: https://registry.modelcontextprotocol.io
# Method: CLI mcp-publisher (requires GitHub namespace verification)

## Server Metadata

name: codexia-mcp
namespace: io.github.etnaesor
display_name: "CODEX·IA — Mexican Law MCP Server"
description: "Complete Mexican legislation as MCP tools. Full-text search across 59,000+ legal documents with SQLite FTS5. Returns verbatim statutory text — zero LLM summarization, zero hallucination. Covers federal laws, jurisprudence, regulations, and state legislation."
version: "0.1.0"
license: Apache-2.0
repository: https://github.com/etnaesor/codexia-mcp
homepage: https://codexia.mx
author: CORPUSIA
contact: informacionDREV@protonmail.com

## Tools Exposed

- search_law: Full-text search with FTS5 snippet() across Mexican legislation
- get_article: Verbatim text of specific legal articles (zero LLM summarization)
- list_statutes: Browsable catalog filtered by legal branch and jurisdiction
- check_updates: Drift detection against Mexico's Official Gazette (DOF)

## Tags
law, legal, mexico, legislation, spanish, fts5, sqlite, compliance, legaltech

## Publishing Command
```bash
./bin/mcp-publisher publish --namespace io.github.etnaesor --name codexia-mcp
```
