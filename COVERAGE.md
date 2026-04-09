# CODEX·IA — Coverage Report

## Objetivo

59,000 documentos cubriendo las 34 ramas del derecho mexicano.

## Fuentes y estado actual

### ✅ Fase 1 — Seed + Federal (Semanas 1-2)

| Fuente | URL | Docs | Formato | Estado |
|--------|-----|------|---------|--------|
| Acervo CORPUSIA | interno | 1,063 | JSON | ✅ Seed |
| Cámara de Diputados | diputados.gob.mx | 317+ | ZIP/HTML (ISO-8859-1) | 🔄 En progreso |

### 🔄 Fase 2 — Expansión (Meses 1-3)

| Fuente | URL | Docs | Formato | Estado |
|--------|-----|------|---------|--------|
| SCJN/SJF Bicentenario | bicentenario.scjn.gob.mx | 250,000 | API CSV/JSON | ⏳ Pendiente |
| DOF/SIDOF | sidof.segob.gob.mx | Reformas | API JSON | ⏳ Pendiente |
| Orden Jurídico Nacional | ordenjuridico.gob.mx | 90,000 | HTML scraping | ⏳ Pendiente |
| SINEC (NOMs) | sinec.gob.mx | 700+ | HTML scraping | ⏳ Pendiente |
| IIJ-UNAM | juridicas.unam.mx | 41,000+ | OAI-PMH | ⏳ Pendiente |
| SRE Tratados | sre.gob.mx | 500+ | HTML scraping | ⏳ Pendiente |

## Restricciones técnicas conocidas

- **ISP blocks desde Querétaro**: apps.cjf.gob.mx, oaj.gob.mx, hcnl.gob.mx
- **SCJN mantenimiento nocturno**: 503 antes de 8AM — scripts: 9AM-10PM
- **Cámara de Diputados**: encoding ISO-8859-1 (no UTF-8)
- **SCJN buscador**: SPA JavaScript (requiere Playwright)
- **Vercel**: límite 250 MB por función serverless
