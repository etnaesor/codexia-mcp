# Twitter/X — Launch Thread
# Account: @corpusia (or dedicated @codexia_mx)

## Thread

**1/7**
🏛️ Introducing CODEX·IA — the first MCP server for Mexican law.

59,000+ legal documents. FTS5 search <100ms. Verbatim text. Zero hallucination.

Open source. Apache 2.0.

npm i @corpusia/codexia-mcp

🧵👇

**2/7**
The problem: LLMs hallucinate legal content.

They invent articles, cite non-existent laws, mix jurisdictions.

In legal work, one wrong citation = millions in liability.

And Mexico has NO structured API for its legislation. Zero. 8 government portals, incompatible formats, no API.

**3/7**
The solution: give the AI direct access to the actual law.

CODEX·IA indexes all Mexican legislation into SQLite FTS5 and exposes 4 MCP tools:

⚡ search_law — full-text search
§ get_article — verbatim text
☰ list_statutes — browsable catalog
↻ check_updates — reform detection

**4/7**
get_article("LFT", "48") returns the EXACT text of Article 48 of the Federal Labor Law.

Not a summary. Not a paraphrase. The actual law.

This is the fix for legal AI hallucination: source-grounded retrieval at the data layer.

**5/7**
Built on the @AnsvarSystems pattern (80+ jurisdictions, Apache 2.0):

Official sources → Parser → SQLite FTS5 → MCP Tools → Claude/Cursor

TypeScript. Vercel serverless. Sub-100ms search in Spanish.

**6/7**
We built this because our own platform @corpusia (42+ legal AI agents) was hallucinating citations.

The fix wasn't better prompts. It was better data infrastructure.

Now CODEX·IA feeds our RAG anti-hallucination pipeline (Creator→Critic pattern).

**7/7**
CODEX·IA is:
✅ Open source (Apache 2.0)
✅ The ONLY MCP server for Mexican law
✅ The ONLY structured API for Mexican legislation
✅ Free for federal laws (Pro tier for full coverage)

GitHub: github.com/etnaesor/codexia-mcp
Web: codexia.mx

Built by @corpusia 🇲🇽
