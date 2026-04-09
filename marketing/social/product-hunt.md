# Product Hunt — Launch Post
# URL: https://www.producthunt.com/posts/new

## Product Name
CODEX·IA

## Tagline (60 chars max)
Mexican law as an MCP tool for Claude & Cursor

## Description
CODEX·IA is the first MCP server for Mexican legislation. It indexes 59,000+ legal documents from 8 official government sources and exposes them as tools that Claude, Cursor, and any MCP-compatible AI can use directly.

The problem: LLMs hallucinate legal content. They invent articles, cite non-existent laws, and mix jurisdictions. In legal work, one wrong citation can cost millions.

The solution: CODEX·IA returns verbatim statutory text from official sources. Zero paraphrasing, zero summarization. The response IS the law.

4 MCP tools:
- search_law — Full-text search with FTS5 (<100ms)
- get_article — Exact text of any article
- list_statutes — Browse by legal branch
- check_updates — Detect legislative reforms via DOF

Built with TypeScript + SQLite FTS5. Open source (Apache 2.0). Based on the Ansvar Systems pattern proven across 80+ jurisdictions worldwide.

## Topics
- Legal Tech
- Artificial Intelligence
- Developer Tools
- Open Source
- MCP (Model Context Protocol)

## Links
- Website: https://codexia.mx
- GitHub: https://github.com/etnaesor/codexia-mcp
- npm: https://www.npmjs.com/package/@corpusia/codexia-mcp

## Maker Comment (first comment on launch)
Hey Product Hunt! I'm Alejandro, founder of CORPUSIA — a Mexican LegalTech platform with 42+ AI agents for legal document generation.

We built CODEX·IA because our own AI was hallucinating legal citations. The fix wasn't better prompts — it was giving the AI direct access to the actual law.

Mexico has NO structured API for its legislation. 8 government portals, incompatible formats, ISO-8859-1 encoding, JavaScript SPAs that need Playwright to scrape. We unified all of it into a single SQLite database with sub-100ms search.

Now any developer can `npm install @corpusia/codexia-mcp` and their AI consults Mexican law directly.

Would love your feedback! What jurisdiction should we add next?
