# CODEX·IA

**Mexican Law MCP Server** — Legislación mexicana completa como herramienta MCP

[![npm](https://img.shields.io/npm/v/@corpusia/codexia-mcp)](https://www.npmjs.com/package/@corpusia/codexia-mcp)
[![License](https://img.shields.io/badge/license-Apache%202.0-blue)](LICENSE)
[![MCP](https://img.shields.io/badge/MCP-compatible-brightgreen)](https://modelcontextprotocol.io)

> 59,000 documentos legales mexicanos indexados. Búsqueda full-text < 100ms.
> Texto verbatim sin alucinaciones. Para Claude, Cursor y cualquier cliente MCP.

**Powered by [CORPUSIA](https://corpusia.net)**

---

## ¿Qué es CODEX·IA?

CODEX·IA es un servidor [MCP](https://modelcontextprotocol.io) (Model Context Protocol) que indexa la legislación mexicana completa y la expone como herramienta de consulta directa para Claude, Cursor y cualquier cliente MCP compatible.

- **Zero alucinaciones**: `get_article()` devuelve texto verbatim de fuentes oficiales
- **Búsqueda instantánea**: SQLite FTS5 optimizado para español, < 100ms
- **Siempre actualizado**: Drift detection contra el Diario Oficial de la Federación
- **Open source**: Apache 2.0, basado en el patrón [Ansvar Systems](https://github.com/Ansvar-Systems)

## Inicio rápido

### 1. Instalar

```bash
npm install @corpusia/codexia-mcp

# O ejecutar directamente
npx @corpusia/codexia-mcp
```

### 2. Configurar Claude Desktop

Agrega esto a tu `claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "codexia": {
      "type": "url",
      "url": "https://codexia.corpusia.net/mcp"
    }
  }
}
```

### 3. Consultar la ley

Pregunta en lenguaje natural — Claude invoca CODEX·IA automáticamente:

```
> ¿Cuáles son los derechos del arrendatario según el Código Civil Federal?

⚡ search_law("derechos arrendatario") → 12 resultados en 34ms
§ get_article("CCF", "2412") → Art. 2412 [texto verbatim]
```

## Herramientas MCP

| Tool | Descripción |
|------|-------------|
| `search_law` | Búsqueda full-text con FTS5 snippet() — encuentra artículos por palabras clave |
| `get_article` | Texto verbatim de un artículo específico — zero LLM summarization |
| `list_statutes` | Catálogo navegable por materia y jurisdicción |
| `check_updates` | Drift detection contra DOF para detectar reformas legislativas |

Ver documentación completa en [TOOLS.md](TOOLS.md).

## Fuentes de datos

| Fuente | Documentos | Estado |
|--------|-----------|--------|
| Cámara de Diputados | 317+ leyes federales | ✅ Activo |
| SCJN / SJF Bicentenario | 250,000 tesis | ✅ Activo |
| DOF / SIDOF | Reformas (API JSON) | ✅ Activo |
| Orden Jurídico Nacional | 90,000 docs estatales | 🔄 Fase 2 |
| SINEC (NOMs) | 700+ normas | 🔄 Fase 2 |
| IIJ-UNAM | 41,000+ recursos | 🔄 Fase 2 |
| SRE Tratados | 500+ tratados | 🔄 Fase 2 |
| Acervo CORPUSIA | 1,063 docs procesados | ✅ Seed |

**Cobertura objetivo**: 59,000 documentos — 34 ramas del derecho mexicano.

Ver detalles en [COVERAGE.md](COVERAGE.md).

## Arquitectura

```
Fuentes oficiales → Scrapers/APIs → Provision Parser → SQLite FTS5 → MCP Tools → Claude/Cursor
```

Pipeline basado en el patrón [Ansvar Systems](https://github.com/Ansvar-Systems) probado en 80+ jurisdicciones.

## Desarrollo

```bash
# Clonar
git clone https://github.com/etnaesor/codexia-mcp.git
cd codexia-mcp

# Instalar dependencias
npm install

# Crear base de datos vacía
npm run build:db

# Ingestar datos
npm run ingest

# Ejecutar servidor MCP (desarrollo)
npm run dev

# Ejecutar drift detection
npm run drift:detect
```

## Stack técnico

- **TypeScript** — tipo seguro de extremo a extremo
- **SQLite + FTS5** — búsqueda full-text optimizada para español
- **MCP SDK** — protocolo estándar de Anthropic para tool-use
- **Vercel** — deploy serverless (< 250 MB por función)
- **Zod** — validación de schemas

## Licencia

[Apache License 2.0](LICENSE)

## Links

- 🌐 **Web**: [codexia.mx](https://codexia.mx)
- 📦 **npm**: [@corpusia/codexia-mcp](https://www.npmjs.com/package/@corpusia/codexia-mcp)
- 🔗 **Endpoint**: `codexia.corpusia.net/mcp`
- 🏢 **CORPUSIA**: [corpusia.net](https://corpusia.net)
- 📧 **Contacto**: informacionDREV@protonmail.com

---

<p align="center">
  <strong>CODEX·IA</strong> — Powered by <a href="https://corpusia.net">CORPUSIA</a><br>
  Legislación mexicana completa como herramienta MCP
</p>
