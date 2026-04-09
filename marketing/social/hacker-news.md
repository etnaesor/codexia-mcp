# Hacker News — Show HN Post
# URL: https://news.ycombinator.com/submit

## Title
Show HN: CODEX·IA – All Mexican law as an MCP server (SQLite FTS5, Apache 2.0)

## URL
https://github.com/etnaesor/codexia-mcp

## Text (for self-post, if no URL)
We built an MCP server that indexes Mexico's complete legal corpus (59K+ documents) into SQLite with FTS5 and exposes it as tools for Claude/Cursor.

The backstory: we run CORPUSIA, a legal AI platform in Mexico. Our AI agents were hallucinating legal citations — inventing articles, citing wrong laws. The root cause wasn't the LLM; it was that no structured, machine-readable source of Mexican law exists. The government publishes legislation as HTML, PDFs, and ZIP files in ISO-8859-1 encoding across 8 different portals with no API.

We followed the Ansvar Systems pattern (github.com/Ansvar-Systems, 80+ jurisdictions, Apache 2.0): scrape official sources → parse into article-level chunks → build SQLite FTS5 index → expose via MCP tools.

4 tools: search_law (FTS5 snippet), get_article (verbatim text, zero LLM summarization), list_statutes (catalog by legal branch), check_updates (drift detection against the Official Gazette).

Stack: TypeScript, better-sqlite3, MCP SDK, Vercel serverless.

The key insight: for legal AI, the answer to hallucination isn't better prompting — it's giving the model direct access to source text. get_article() returns the exact statutory text. The LLM never paraphrases the law.

GitHub: https://github.com/etnaesor/codexia-mcp
npm: @corpusia/codexia-mcp
