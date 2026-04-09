# CODEX·IA — Competitive Analysis Summary

## Direct Competitor: Ansvar Systems (Stockholm)

- 80+ jurisdiction MCP servers (US, EU, Germany, Spain, South Korea, etc.)
- IDENTICAL architecture: TypeScript + SQLite FTS5 + MCP SDK + Vercel
- 8-19 tools per server (vs our 4 — expansion needed)
- npm distribution (@ansvar/*) + hosted Vercel endpoints
- Apache 2.0 license
- Does NOT yet cover Mexico — our window of opportunity
- **Risk:** Could build Mexico server in weeks using their template

## Enterprise Legal AI (NOT direct competitors but context)

| Platform | Valuation/Revenue | Hallucination Rate | MCP Support |
|----------|------------------|-------------------|-------------|
| Harvey AI | $11B valuation | Unknown | ❌ None |
| Thomson Reuters CoCounsel | $500+/user/mo | ~8% | ❌ None |
| LexisNexis Protégé | $500+/user/mo | ~11% | ❌ None |
| vLex/Clio Vincent | $399/user/mo | Unknown | ❌ None |
| Legora (Sweden) | $5.55B valuation | Unknown | ❌ None |
| **CODEX·IA** | **Open source** | **0% by design** | **✅ Native** |

## Key Insight
No enterprise legal AI platform supports MCP. CODEX·IA has the agentic AI channel entirely to itself.

## Mexican LegalTech Landscape

| Competitor | Focus | AI | MCP | Threat Level |
|-----------|-------|------|-----|-------------|
| vLex Mexico | Legal database | Vincent AI | ❌ | Medium (could add MCP) |
| Tirant lo Blanch MX | Editorial + AI | Sof-IA 3.0 | ❌ | Low |
| SCJN JulIA | Jurisprudence search | JurisBERT | ❌ | Low (only case law) |
| MiDespacho.Cloud | Practice management | No | ❌ | None |
| LemonTech (Chile→MX) | Practice management | No | ❌ | None |

## CODEX·IA Unique Advantages

1. **Only MCP server for Mexican law** (zero competition)
2. **Only structured API for Mexican legislation** (no government API exists)
3. **0% hallucination by design** (verbatim text, no LLM in retrieval)
4. **Open source** (Apache 2.0 — trust + community)
5. **Dual revenue** (internal CORPUSIA infra + public npm product)

## Recommended Actions (Priority Order)

1. Expand from 4 to 8-12 MCP tools (match Ansvar feature parity)
2. Publish to npm + register on 6 MCP registries
3. Deploy hosted Vercel endpoint (zero-install experience)
4. Consider Ansvar partnership (become their Mexico jurisdiction)
5. Integrate RoBERTalex/MEL embeddings for semantic search
6. Link SCJN datos abiertos for unified legislation + jurisprudence
