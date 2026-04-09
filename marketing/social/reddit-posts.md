# Reddit — Posts for multiple subreddits

## r/ClaudeAI

**Title:** I built an MCP server that gives Claude access to all Mexican law — verbatim text, zero hallucination

**Body:**
After our legal AI platform (CORPUSIA) kept hallucinating Mexican law citations, we built CODEX·IA — an MCP server that indexes 59,000+ Mexican legal documents and exposes them as Claude tools.

When you ask Claude a legal question about Mexican law with CODEX·IA connected, it calls `search_law()` to find relevant articles, then `get_article()` to retrieve the exact statutory text. No paraphrasing, no summarization — the response is the law itself.

4 tools: search_law, get_article, list_statutes, check_updates (drift detection against Mexico's Official Gazette).

Stack: TypeScript + SQLite FTS5 (<100ms search) + MCP SDK. Apache 2.0.

Config for Claude Desktop:
```json
{ "mcpServers": { "codexia": { "type": "url", "url": "https://codexia.corpusia.net/mcp" } } }
```

GitHub: https://github.com/etnaesor/codexia-mcp

---

## r/LocalLLaMA

**Title:** Open-source MCP server for Mexican law — SQLite FTS5 + verbatim text retrieval (Apache 2.0)

**Body:**
Released CODEX·IA, an MCP server that provides structured access to Mexican legislation for any LLM client. Uses SQLite FTS5 for sub-100ms full-text search in Spanish. Returns exact statutory text — no LLM in the retrieval loop.

The interesting technical bit: Mexico has NO structured API for its legal corpus. We scrape 8 government portals (HTML, PDF, ZIP in ISO-8859-1), parse everything into article-level chunks, and build an FTS5 index. The pattern is from Ansvar Systems who've done this for 80+ countries.

GitHub: https://github.com/etnaesor/codexia-mcp

---

## r/mexico

**Title:** Creamos una herramienta open source que le da a la IA acceso directo a toda la legislación mexicana (CODEX·IA)

**Body:**
¿Alguna vez le preguntaron a ChatGPT o Claude sobre una ley mexicana y les inventó artículos que no existen? Nosotros también. Por eso construimos CODEX·IA.

Es un servidor MCP (Model Context Protocol) que indexa toda la legislación mexicana — 317+ leyes federales, jurisprudencia de la SCJN, reformas del DOF — y se la da como herramienta directa a Claude, Cursor, y cualquier IA compatible.

La diferencia clave: cuando la IA cita un artículo, el texto viene DIRECTO de la fuente oficial. No parafrasea, no resume, no inventa.

Open source, Apache 2.0: https://github.com/etnaesor/codexia-mcp
