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

**Option A: Nur Strapi im Host (schneller für Entwicklung)**
```bash
npm run dev
```

**Option B: Alles in Docker (näher an Produktion)**
```bash
npm run docker:dev
```

Das Admin Panel ist verfügbar unter: http://localhost:1337/admin

### 5. Testdaten laden (optional)
```bash
npm run db:seed          # Bei Option A
npm run db:seed:docker   # Bei Option B
```

## 📁 Projektstruktur

```
strapi-admin/
├── config/                  # Strapi-Konfiguration
├── src/
│   ├── api/                 # Content-Types (Team, Player, Match, etc.)
│   ├── components/          # Wiederverwendbare Komponenten (SEO, etc.)
│   └── index.ts             # Bootstrap & Seeding
├── nginx/                   # Nginx-Konfiguration (Produktion)
├── docker-compose.yml       # Produktion (Strapi + Postgres + Nginx)
├── docker-compose.dev.yml   # Entwicklung (Postgres + Strapi optional)
├── Dockerfile               # Produktion Image
├── Dockerfile.dev           # Entwicklung Image (mit Hot-Reload)
├── .env.example             # Template für Umgebungsvariablen
└── DEPLOYMENT.md            # Deployment-Anleitung
```

## 🔧 Verfügbare Befehle

### Entwicklung (Option A: Strapi auf Host)
| Befehl | Beschreibung |
|--------|--------------|
| `npm run docker:db` | Nur PostgreSQL starten |
| `npm run dev` | Strapi mit Hot-Reload starten |
| `npm run db:seed` | Testdaten laden |

### Entwicklung (Option B: Alles in Docker)
| Befehl | Beschreibung |
|--------|--------------|
| `npm run docker:dev` | Postgres + Strapi starten |
| `npm run docker:dev:build` | Strapi Image neu bauen |
| `npm run docker:dev:logs` | Logs anzeigen |
| `npm run docker:dev:stop` | Alles stoppen |
| `npm run docker:dev:reset` | Alles löschen und neu starten |
| `npm run db:seed:docker` | Testdaten laden (Docker) |

### Tools
| Befehl | Beschreibung |
|--------|--------------|
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

**Produktion:** https://api.florianbirkenberger.de

## 📚 Dokumentation

- [Strapi Dokumentation](https://docs.strapi.io)
- [Strapi REST API](https://docs.strapi.io/dev-docs/api/rest)
- [Strapi Admin Panel](https://docs.strapi.io/user-docs/intro)
