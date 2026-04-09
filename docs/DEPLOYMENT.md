# CODEX·IA — Deployment Guide

## Option 1: Vercel Serverless (Recommended)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
```

**Endpoint:** `https://codexia.corpusia.net/mcp`

**Constraints:**
- Max 250 MB per serverless function (SQLite DB must fit)
- If DB exceeds 250 MB, use GitHub Releases download strategy at runtime
- Cold start: ~2s first request, then <100ms

### vercel.json
```json
{
  "functions": {
    "api/**": { "maxDuration": 30 }
  },
  "rewrites": [
    { "source": "/mcp", "destination": "/api/mcp" }
  ]
}
```

## Option 2: npm (Self-hosted)

```bash
npm install @corpusia/codexia-mcp
npx @corpusia/codexia-mcp
```

Starts a stdio MCP server locally. Configure Claude Desktop:
```json
{
  "mcpServers": {
    "codexia": {
      "command": "npx",
      "args": ["@corpusia/codexia-mcp"]
    }
  }
}
```

## Option 3: Docker

```dockerfile
FROM node:20-slim
WORKDIR /app
COPY package*.json ./
RUN npm ci --production
COPY dist/ ./dist/
COPY data/codexia.db ./data/
CMD ["node", "dist/index.js"]
```

```bash
docker build -t codexia-mcp .
docker run -p 3000:3000 codexia-mcp
```
