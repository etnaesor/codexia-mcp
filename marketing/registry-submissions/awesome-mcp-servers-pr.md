# Awesome MCP Servers — Pull Request
# URL: https://github.com/punkpeye/awesome-mcp-servers
# Method: GitHub Pull Request adding entry to README.md

## PR Title
Add CODEX·IA — Mexican Law MCP Server

## Entry to add (under "Law & Legal" or "Government" section)

```markdown
- [CODEX·IA](https://github.com/etnaesor/codexia-mcp) - Complete Mexican legislation as MCP tools. Full-text search (FTS5 <100ms), verbatim article text, statute catalog, and DOF reform detection. 59,000+ documents across 34 branches of Mexican law. By CORPUSIA.
```

## PR Description
Adding CODEX·IA, a Mexican Law MCP server that indexes all Mexican legislation (federal laws, jurisprudence, regulations, state law) and exposes it via 4 MCP tools. Built on the Ansvar Systems pattern (Apache 2.0), using TypeScript + SQLite FTS5 for sub-100ms full-text search in Spanish. The only MCP server for Mexican law — no structured API for Mexican legislation existed before this.

**Key differentiator:** Returns verbatim statutory text (zero LLM summarization), addressing the legal AI hallucination problem directly at the data layer.
