# Strapi 5 CMS - Volleystars

Headless CMS für die Volleystars Vereinswebsite mit TypeScript und PostgreSQL.

## 📋 Voraussetzungen

- Node.js >= 20.x (max 24.x)
- npm >= 6.x
- Docker & Docker Compose

## 🚀 Schnellstart (Lokale Entwicklung)

### 1. Repository klonen
```bash
git clone https://github.com/datafist/strapi-admin.git
cd strapi-admin
npm install
```

### 2. Umgebungsvariablen einrichten
```bash
cp .env.example .env
# Werte sind für Entwicklung bereits vorkonfiguriert
```

### 3. PostgreSQL starten (Docker)
```bash
npm run docker:dev
```

### 4. Strapi starten
```bash
npm run dev
```

Das Admin Panel ist verfügbar unter: http://localhost:1337/admin

### 5. Testdaten laden (optional)
```bash
npm run db:seed
```

## 📁 Projektstruktur

```
strapi-admin/
├── config/                  # Strapi-Konfiguration
├── src/
│   ├── api/                 # Content-Types (Team, Player, Match, etc.)
│   │   └── health/          # Health-Check Endpoint für Docker
│   ├── components/          # Wiederverwendbare Komponenten (SEO, etc.)
│   └── index.ts             # Bootstrap & Seeding
├── docker-compose.yml       # Produktion (Strapi + Postgres + Traefik)
├── docker-compose.dev.yml   # Entwicklung (nur PostgreSQL)
├── Dockerfile               # Produktion Image
├── .env.example             # Template für Umgebungsvariablen
└── DEPLOYMENT.md            # Deployment-Anleitung
```

## 🔧 Verfügbare Befehle

### Entwicklung
| Befehl | Beschreibung |
|--------|--------------|
| `npm run docker:dev` | PostgreSQL starten |
| `npm run dev` | Strapi mit Hot-Reload starten |
| `npm run db:seed` | Testdaten laden |
| `npm run docker:dev:stop` | PostgreSQL stoppen |
| `npm run docker:dev:reset` | Datenbank zurücksetzen |
| `npm run docker:pgadmin` | pgAdmin starten (http://localhost:5050) |

### Produktion
| Befehl | Beschreibung |
|--------|--------------|
| `npm run build` | Admin Panel bauen |
| `npm run start` | Produktionsserver starten |
| `npm run docker:prod` | Alle Container starten |
| `npm run docker:prod:build` | Strapi-Image neu bauen |

## 🗄️ Content-Types

| Name | Beschreibung |
|------|--------------|
| Team | Mannschaften (Damen 1, etc.) |
| Player | Spielerinnen mit Position, Nummer |
| Coach | Trainer |
| Match | Spielplan & Ergebnisse |
| News Article | Vereinsnews mit SEO |
| Page | Statische Seiten |
| Homepage | Startseite-Konfiguration |
| Club Info | Vereinsdaten (Single Type) |
| Achievement | Erfolge & Titel |

## 🌐 Deployment

Siehe [DEPLOYMENT.md](DEPLOYMENT.md) für die vollständige Anleitung zum Deployment auf einem VPS mit Docker.

**Produktion:** https://strapi.florianbirkenberger.de

## 📚 Dokumentation

- [Strapi Dokumentation](https://docs.strapi.io)
- [Strapi REST API](https://docs.strapi.io/dev-docs/api/rest)
- [Strapi Admin Panel](https://docs.strapi.io/user-docs/intro)
