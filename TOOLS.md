# CODEX·IA — MCP Tools Reference

## search_law

Búsqueda full-text en toda la legislación mexicana indexada.

**Parámetros:**
- `query` (string, required) — Términos de búsqueda en español. Soporta operadores FTS5: AND, OR, NOT, NEAR().
- `limit` (number, 1-50, default: 10) — Máximo de resultados.
- `materia` (string, optional) — Filtrar: laboral, civil, penal, fiscal, mercantil, constitucional, administrativo, amparo.
- `jurisdiction` (string, optional) — Filtrar: federal, estatal:jalisco, estatal:cdmx, etc.

**Ejemplo:**
```
search_law("derechos trabajador despido injustificado", limit: 5, materia: "laboral")
→ 5 resultados en 28ms con snippets de contexto
```

**Técnico:** Usa SQLite FTS5 snippet() con tokenizer unicode61 remove_diacritics. Retorna snippets con contexto resaltado.

---

## get_article

Texto VERBATIM de un artículo específico. Zero LLM summarization.

**Parámetros:**
- `statute_code` (string, required) — Código de la ley: CPEUM, LFT, CCF, CFF, LGIMH, etc.
- `article` (string, required) — Número del artículo: "123", "48", "2412", "1-Bis".

**Ejemplo:**
```
get_article("LFT", "48")
→ Art. 48. El trabajador podrá solicitar ante la Junta de Conciliación
  y Arbitraje, a su elección, que se le reinstale en el trabajo que
  desempeñaba, o que se le indemnice con el importe de tres meses
  de salario, a razón del que corresponda a la fecha en que se realice
  el pago. [texto verbatim completo]
```

**IMPORTANTE:** Esta herramienta devuelve texto exacto de la fuente oficial. NO parafrasea, NO resume, NO interpreta. La respuesta ES la ley.

---

## list_statutes

Catálogo navegable de toda la legislación indexada.

**Parámetros:**
- `materia` (string, optional) — Filtrar por rama del derecho.
- `jurisdiction` (string, optional) — Filtrar por jurisdicción.
- `limit` (number, 1-100, default: 25) — Máximo de resultados.

**Ejemplo:**
```
list_statutes(materia: "laboral")
→ 24 leyes: LFT, Ley del IMSS, Ley del INFONAVIT, Ley del ISSSTE...
```

---

## check_updates

Drift detection contra el Diario Oficial de la Federación.

**Parámetros:**
- `since` (string, optional) — Fecha desde la cual buscar reformas (YYYY-MM-DD). Default: últimos 30 días.
- `statute_code` (string, optional) — Filtrar por ley específica.
- `materia` (string, optional) — Filtrar por materia.

**Ejemplo:**
```
check_updates(since: "2026-01-01", materia: "fiscal")
→ 7 reformas detectadas, 3 pendientes de aplicar:
  ⚠️ 2026-03-15 — CFF (Código Fiscal de la Federación)
  ⚠️ 2026-02-28 — LISR (Ley del Impuesto sobre la Renta)
  ✅ 2026-01-15 — LIVA (Ley del IVA) [ya aplicada]
```

---

## Códigos de leyes comunes

| Código | Ley |
|--------|-----|
| CPEUM | Constitución Política de los Estados Unidos Mexicanos |
| CCF | Código Civil Federal |
| LFT | Ley Federal del Trabajo |
| CFF | Código Fiscal de la Federación |
| CPF | Código Penal Federal |
| CFPC | Código Federal de Procedimientos Civiles |
| LA | Ley de Amparo |
