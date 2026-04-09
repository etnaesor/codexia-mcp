# CODEX·IA — Data Sources Reference

## Federal Legislation

### Cámara de Diputados
- **URL:** https://www.diputados.gob.mx/LeyesBiblio/
- **Format:** ZIP archive with HTML/DOC files
- **Encoding:** ISO-8859-1 (MUST convert to UTF-8)
- **Content:** 317+ federal laws (complete text with articles)
- **Update frequency:** Updated after DOF reforms
- **Access:** Public, no authentication

### DOF / SIDOF
- **URL:** https://sidof.segob.gob.mx
- **Format:** JSON API (undocumented endpoints)
- **Endpoints:** WS_getDiarioFecha.php, WS_getDiarioPDF.php
- **Content:** Daily Official Gazette publications, reform decrees
- **Update frequency:** Daily
- **Access:** Public, no authentication

### Orden Jurídico Nacional
- **URL:** https://www.ordenjuridico.gob.mx
- **Format:** HTML scraping required
- **Content:** 90,000+ documents (federal + 32 states)
- **Update frequency:** Periodic
- **Access:** Public, no authentication

## Jurisprudence

### SCJN / SJF Repositorio Bicentenario
- **URL:** https://bicentenario.scjn.gob.mx
- **Format:** CSV/JSON via datos abiertos portal
- **Content:** 250,000+ tesis (aisladas + jurisprudencia)
- **Update frequency:** Updated with new court sessions
- **Access:** Public API, no authentication
- **Note:** Buscador is JavaScript SPA (Playwright needed for UI scraping). Datos abiertos portal offers bulk CSV/JSON download.
- **Maintenance:** 503 errors before 8AM — run scripts 9AM-10PM only

## Regulations

### SINEC (NOMs)
- **URL:** https://www.sinec.gob.mx
- **Format:** HTML scraping required
- **Content:** 700+ Normas Oficiales Mexicanas (technical standards)
- **Access:** Public

## Academic

### IIJ-UNAM
- **URL:** https://www.juridicas.unam.mx
- **Format:** OAI-PMH protocol
- **Content:** 41,000+ academic legal resources
- **Access:** Public, OAI-PMH endpoint

## International Treaties

### SRE (Secretaría de Relaciones Exteriores)
- **URL:** https://www.sre.gob.mx
- **Format:** HTML scraping required
- **Content:** 500+ international treaties ratified by Mexico
- **Access:** Public

## Internal

### Acervo CORPUSIA
- **Source:** CORPUSIA MongoDB (internal)
- **Format:** Processed JSON documents
- **Content:** 1,063 legal documents (already parsed and structured)
- **Status:** Seed data for Phase 1

## Known ISP Blocks (from Querétaro)

The following domains are blocked by some ISPs in Querétaro:
- apps.cjf.gob.mx
- oaj.gob.mx
- hcnl.gob.mx

Workaround: Use VPN or cloud-based scrapers for these sources.
