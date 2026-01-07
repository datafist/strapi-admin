# Strapi 5 Deployment auf Hostinger VPS mit Docker

## Übersicht

Diese Anleitung beschreibt das Deployment von Strapi 5 auf einem Hostinger VPS mit:
- **Docker** für Container-Orchestrierung
- **PostgreSQL** als Datenbank (gleiche DB wie lokal)
- **Traefik** als Reverse Proxy (externer Stack)
- **Let's Encrypt** für SSL-Zertifikate (via Traefik)
- **Domain**: `strapi.florianbirkenberger.de`

## Architektur

```
┌─────────────────────────────────────────────────────────────┐
│                     ENTWICKLUNG (Lokal)                      │
├─────────────────────────────────────────────────────────────┤
│  npm run dev          ←→    PostgreSQL (Docker)              │
│  localhost:1337              localhost:5432                  │
│                                                              │
│  Dateien: .env, docker-compose.dev.yml                       │
└─────────────────────────────────────────────────────────────┘
                              │
                         git push
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                     PRODUKTION (VPS)                         │
├─────────────────────────────────────────────────────────────┤
│  ┌─────────┐    ┌─────────┐    ┌──────────┐                 │
│  │ Traefik │ ←→ │ Strapi  │ ←→ │ Postgres │                 │
│  │  :443   │    │  :1337  │    │  :5432   │                 │
│  └─────────┘    └─────────┘    └──────────┘                 │
│       │              │                                       │
│  SSL (Let's Encrypt) │                                       │
│  (externer Stack)    └── web (Docker Network)               │
│                                                              │
│  Dateien: .env (manuell erstellt), docker-compose.yml        │
└─────────────────────────────────────────────────────────────┘
```

---

## Voraussetzungen

- Hostinger VPS mit Ubuntu 22.04+ oder Debian 11+
- Domain mit DNS-Zugriff
- SSH-Zugang zum VPS

---

## 1. VPS vorbereiten

### 1.1 Mit SSH verbinden
```bash
ssh root@DEINE_VPS_IP
```

### 1.2 System aktualisieren
```bash
apt update && apt upgrade -y
```

### 1.3 Docker installieren
```bash
# Docker GPG Key hinzufügen
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | gpg --dearmor -o /usr/share/keyrings/docker-archive-keyring.gpg

# Docker Repository hinzufügen
echo "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/docker-archive-keyring.gpg] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable" | tee /etc/apt/sources.list.d/docker.list > /dev/null

# Docker installieren
apt update
apt install -y docker-ce docker-ce-cli containerd.io docker-compose-plugin

# Docker starten und aktivieren
systemctl start docker
systemctl enable docker

# Docker Compose v2 prüfen
docker compose version
```

### 1.4 Firewall konfigurieren
```bash
ufw allow OpenSSH
ufw allow 80/tcp
ufw allow 443/tcp
ufw enable
```

### 1.5 Traefik-Netzwerk prüfen
```bash
# Prüfe ob das Traefik-Netzwerk existiert
docker network ls | grep web

# Falls nicht vorhanden, muss der Traefik-Stack zuerst eingerichtet werden
```

> **Hinweis:** Der Traefik-Stack muss separat eingerichtet sein und das `web`-Netzwerk bereitstellen.

---

## 2. DNS konfigurieren

Im Hostinger DNS-Manager oder deinem Domain-Provider:

| Typ | Name | Wert | TTL |
|-----|------|------|-----|
| A | api | DEINE_VPS_IP | 3600 |

**Beispiel:**
- `strapi.florianbirkenberger.de` → `123.456.789.0`

**Warte 5-30 Minuten** bis DNS propagiert ist. Prüfen mit:
```bash
dig strapi.florianbirkenberger.de +short
```

---

## 3. Projekt auf VPS klonen

### 3.1 Projekt-Verzeichnis erstellen und Repository klonen
```bash
cd /opt
git clone https://github.com/datafist/strapi-admin.git
cd strapi-admin
```

**Danach befindest du dich in:** `/opt/strapi-admin/`

**Verzeichnisstruktur nach dem Klonen:**
```
/opt/strapi-admin/
├── config/
├── src/
├── .env.example             ← Template für .env
├── docker-compose.yml       ← Produktion (Strapi + Postgres + Traefik Labels)
├── docker-compose.dev.yml   ← Entwicklung (nur Postgres)
├── Dockerfile
└── package.json
```

---

## 4. Umgebungsvariablen konfigurieren

### 4.1 Secrets generieren
```bash
# Auf dem VPS oder lokal - 6 Mal ausführen:
openssl rand -base64 32
```

### 4.2 .env Datei erstellen
```bash
nano .env
```

**Inhalt (ALLE WERTE ANPASSEN!):**
```env
# Server
NODE_ENV=production
HOST=0.0.0.0
PORT=1337
PUBLIC_URL=https://strapi.florianbirkenberger.de

# Database (Achtung: HOST ist "postgres", nicht "localhost"!)
DATABASE_CLIENT=postgres
DATABASE_HOST=postgres
DATABASE_PORT=5432
DATABASE_NAME=strapi
DATABASE_USERNAME=strapi
DATABASE_PASSWORD=DEIN_SICHERES_DB_PASSWORT
DATABASE_SSL=false

# Traefik Domain (für SSL-Zertifikat)
DOMAIN=strapi.florianbirkenberger.de

# Secrets (deine generierten Werte einfügen!)
APP_KEYS=schlüssel1,schlüssel2,schlüssel3,schlüssel4
API_TOKEN_SALT=dein_generierter_schlüssel
ADMIN_JWT_SECRET=dein_generierter_schlüssel
TRANSFER_TOKEN_SALT=dein_generierter_schlüssel
ENCRYPTION_KEY=dein_generierter_schlüssel
JWT_SECRET=dein_generierter_schlüssel

# Seeding (nur einmalig bei leerer DB auf true setzen)
SEED_DATA=false
```

**Speichern:** `Ctrl+X`, dann `Y`, dann `Enter`

> ⚠️ **Wichtig:** Die `.env` Datei wird NICHT ins Git committed! Sie existiert nur auf dem Server.

---

## 5. Container starten

**Alle Befehle im Projektordner `/opt/strapi-admin/` ausführen!**

### 5.1 Traefik-Netzwerk prüfen
```bash
# Prüfe ob das externe Traefik-Netzwerk existiert
docker network ls | grep web
```

### 5.2 Container starten
```bash
docker compose up -d
```

### 5.3 Warte bis Container laufen
```bash
docker compose ps
docker compose logs -f strapi
# Warte auf: "Server started on http://0.0.0.0:1337"
# Beenden mit Ctrl+C
```

> **Hinweis:** SSL-Zertifikate werden automatisch von Traefik via Let's Encrypt erstellt.

---

## 6. Deployment testen

### 6.1 Container-Status prüfen
```bash
docker compose ps
```

Alle Container sollten "Up" und "healthy" sein.

### 6.2 Logs prüfen
```bash
docker compose logs -f strapi
```

### 6.3 Admin-Panel öffnen
Öffne im Browser:
```
https://strapi.florianbirkenberger.de/admin
```

**Ersten Admin-User erstellen:**
- First name, Last name
- Email
- Password (mind. 8 Zeichen)
- Klicke "Let's start"

### 6.4 API testen
```bash
curl https://strapi.florianbirkenberger.de/api/achievements
```

---

## 7. Updates deployen

### 7.1 Lokal: Änderungen pushen
```bash
git add .
git commit -m "Update"
git push origin main
```

### 7.2 Auf VPS: Update ziehen und neu bauen
```bash
cd /opt/strapi-admin
git pull origin main
docker compose down
docker compose build --no-cache strapi
docker compose up -d
```

### 7.3 Mit Testdaten starten (optional)
```bash
# Wenn du Testdaten laden möchtest:
SEED_DATA=true docker compose up -d

# Oder später nach dem ersten Start:
docker compose exec strapi sh -c "SEED_DATA=true npm run dev"
```

### 7.4 Logs überwachen
```bash
docker compose logs -f strapi
```

---

## 8. Nützliche Befehle

### Container-Management
```bash
# Status anzeigen
docker compose ps

# Alle Logs
docker compose logs -f

# Nur Strapi Logs
docker compose logs -f strapi

# Container neustarten
docker compose restart strapi

# Alles stoppen
docker compose down

# Alles starten
docker compose up -d
```

### Datenbank-Backup
```bash
# Backup erstellen
docker compose exec postgres pg_dump -U strapi strapi > backup_$(date +%Y%m%d).sql

# Backup wiederherstellen
cat backup_20260103.sql | docker compose exec -T postgres psql -U strapi strapi
```

### Uploads-Backup
```bash
# Backup
docker cp strapi-app:/app/public/uploads ./uploads_backup

# Wiederherstellen
docker cp ./uploads_backup/. strapi-app:/app/public/uploads/
```

### Shell im Container
```bash
docker compose exec strapi sh
docker compose exec postgres psql -U strapi strapi
```

---

## 9. Troubleshooting

### Container startet nicht
```bash
docker compose logs strapi
# Prüfe auf Fehler in .env Datei
```

### Datenbank-Verbindungsfehler
```bash
# Prüfe ob postgres läuft
docker compose ps postgres

# Prüfe Credentials in .env
cat .env | grep DATABASE_PASSWORD

# Prüfe ob Container das gleiche Passwort hat
docker compose exec postgres psql -U strapi -d strapi -c "SELECT version();"

# Falls Auth-Fehler: Container neu starten (löscht alte DB)
docker compose down -v
docker compose up -d postgres
docker compose up -d strapi
```

### Traefik erkennt Container nicht
```bash
# Prüfe ob Container im web-Netzwerk ist
docker network inspect web

# Prüfe Traefik-Labels
docker inspect strapi-app | grep -A 20 Labels

# Prüfe Traefik-Logs
docker logs traefik 2>&1 | tail -50
```

### Speicherplatz prüfen
```bash
df -h
docker system prune -a  # Alte Images löschen
```

---

## 10. Architektur-Übersicht

```
                    Internet
                        │
                        ▼
                   ┌─────────┐
                   │ Traefik │ :80/:443
                   │ (Proxy) │ (externer Stack)
                   └────┬────┘
                        │
                   web network
                        │
         ┌──────────────┴──────────────┐
         │                             │
         ▼                             ▼
    ┌─────────┐                   ┌──────────┐
    │ Strapi  │                   │ Uploads  │
    │  :1337  │                   │ (Volume) │
    └────┬────┘                   └──────────┘
         │
    strapi-network
         │
         ▼
    ┌──────────┐
    │ Postgres │
    │  :5432   │
    └──────────┘
```

**Netzwerke:**
- `web` - Externes Netzwerk für Traefik-Kommunikation
- `strapi-network` - Internes Netzwerk für Strapi ↔ Postgres

**URLs:**
- Admin Panel: `https://strapi.florianbirkenberger.de/admin`
- REST API: `https://strapi.florianbirkenberger.de/api/`
- Uploads: `https://strapi.florianbirkenberger.de/uploads/`
