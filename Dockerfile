# Multi-stage build für optimiertes Strapi 5 Image
FROM node:20-alpine AS base

# Installiere Abhängigkeiten für native Module
RUN apk add --no-cache libc6-compat python3 make g++

WORKDIR /app

# Dependencies Stage
FROM base AS deps

COPY package.json package-lock.json* ./

# Installiere nur Production Dependencies
RUN npm ci --only=production

# Builder Stage
FROM base AS builder

COPY package.json package-lock.json* ./
RUN npm ci

COPY . .

# Setze Umgebungsvariablen für Build
ENV NODE_ENV=production

# Baue Strapi Admin Panel
RUN npm run build

# Production Stage
FROM node:20-alpine AS runner

WORKDIR /app

# Installiere wget für Health-Checks
RUN apk add --no-cache wget

# Erstelle non-root User für Sicherheit
RUN addgroup --system --gid 1001 strapi
RUN adduser --system --uid 1001 strapi

# Kopiere notwendige Dateien
COPY --from=deps /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/public ./public
COPY --from=builder /app/config ./config
COPY --from=builder /app/src ./src
COPY --from=builder /app/database ./database
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/tsconfig.json ./tsconfig.json

# Erstelle uploads und tmp Verzeichnisse
RUN mkdir -p /app/public/uploads /app/.tmp
RUN chown -R strapi:strapi /app

# Wechsle zu non-root User
USER strapi

# Setze Umgebungsvariablen
ENV NODE_ENV=production
ENV HOST=0.0.0.0
ENV PORT=1337

EXPOSE 1337

# Starte Strapi
CMD ["npm", "run", "start"]
