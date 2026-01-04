# Strapi 5 Deployment auf Hostinger VPS mit Docker

## Übersicht

Diese Anleitung beschreibt das Deployment von Strapi 5 auf einem Hostinger VPS mit:
- **Docker** für Container-Orchestrierung
- **PostgreSQL** als Datenbank (gleiche DB wie lokal)
- **Nginx** als Reverse Proxy
- **Let's Encrypt** für SSL-Zertifikate
- **Domain**: `api.florianbirkenberger.de`

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
│  │  Nginx  │ ←→ │ Strapi  │ ←→ │ Postgres │                 │
│  │  :443   │    │  :1337  │    │  :5432   │                 │
│  └─────────┘    └─────────┘    └──────────┘                 │
│       │                                                      │
│  SSL-Zertifikat (Let's Encrypt)                             │
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

### 1.5 Certbot installieren (für SSL-Zertifikate)
```bash
apt install -y certbot
```

---

## 2. DNS konfigurieren

Im Hostinger DNS-Manager oder deinem Domain-Provider:

| Typ | Name | Wert | TTL |
|-----|------|------|-----|
| A | api | DEINE_VPS_IP | 3600 |

**Beispiel:**
- `api.florianbirkenberger.de` → `123.456.789.0`

**Warte 5-30 Minuten** bis DNS propagiert ist. Prüfen mit:
```bash
dig api.florianbirkenberger.de +short
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
├── nginx/
│   ├── nginx.conf
│   └── conf.d/
│       ├── strapi.conf
│       └── strapi-initial.conf.template
├── src/
├── .env.example             ← Template für .env
├── docker-compose.yml       ← Produktion (Strapi + Postgres + Nginx)
├── docker-compose.dev.yml   ← Entwicklung (nur Postgres)
├── Dockerfile
└── package.json
```

### 3.2 Certbot-Verzeichnisse erstellen
```bash
mkdir -p certbot/conf certbot/www
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
PUBLIC_URL=https://api.florianbirkenberger.de

# Database (Achtung: HOST ist "postgres", nicht "localhost"!)
DATABASE_CLIENT=postgres
DATABASE_HOST=postgres
DATABASE_PORT=5432
DATABASE_NAME=strapi
DATABASE_USERNAME=strapi
DATABASE_PASSWORD=DEIN_SICHERES_DB_PASSWORT
DATABASE_SSL=false

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
APP_KEYS=schlüssel1,schlüssel2,schlüssel3,schlüssel4
API_TOKEN_SALT=dein_generierter_schlüssel
ADMIN_JWT_SECRET=dein_generierter_schlüssel
TRANSFER_TOKEN_SALT=dein_generierter_schlüssel
JWT_SECRET=dein_generierter_schlüssel

# Seeding (nur einmalig bei leerer DB auf true setzen)
SEED_DATA=false
```

**Speichern:** `Ctrl+X`, dann `Y`, dann `Enter`

> ⚠️ **Wichtig:** Die `.env` Datei wird NICHT ins Git committed! Sie existiert nur auf dem Server.

---

## 5. SSL-Zertifikat einrichten

**Alle Befehle im Projektordner `/opt/strapi-admin/` ausführen!**

### 5.1 Initiale Nginx-Konfiguration (nur HTTP)
```bash
# Im Projektordner /opt/strapi-admin/
cp nginx/conf.d/strapi-initial.conf.template nginx/conf.d/strapi.conf
```

### 5.2 Container starten (ohne SSL)
```bash
docker compose up -d postgres strapi nginx
```

### 5.3 Warte bis Container laufen
```bash
docker compose ps
docker compose logs -f strapi
# Warte auf: "Server started on http://0.0.0.0:1337"
# Beenden mit Ctrl+C
```

### 5.4 SSL-Zertifikat holen
```bash
# Stoppe nginx temporär
docker compose stop nginx

# Hole Zertifikat mit Certbot (standalone)
certbot certonly --standalone \
    --email deine-email@example.com \
    --agree-tos \
    --no-eff-email \
    -d api.florianbirkenberger.de

# Kopiere Zertifikate in Projektordner
cp -rL /etc/letsencrypt/* certbot/conf/

# Prüfe ob Zertifikat erstellt wurde
ls -la certbot/conf/live/api.florianbirkenberger.de/
```

### 5.5 SSL-Konfiguration aktivieren
```bash
# Kopiere vollständige SSL-Konfiguration
cat > nginx/conf.d/strapi.conf << 'EOF'
upstream strapi {
    server strapi:1337;
}

server {
    listen 80;
    listen [::]:80;
    server_name api.florianbirkenberger.de;

    location /.well-known/acme-challenge/ {
        root /var/www/certbot;
    }

    location / {
        return 301 https://$host$request_uri;
    }
}

server {
    listen 443 ssl;
    listen [::]:443 ssl;
    http2 on;
    server_name api.florianbirkenberger.de;

    ssl_certificate /etc/letsencrypt/live/api.florianbirkenberger.de/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/api.florianbirkenberger.de/privkey.pem;

    ssl_session_timeout 1d;
    ssl_session_cache shared:SSL:50m;
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_prefer_server_ciphers off;

    add_header Strict-Transport-Security "max-age=63072000" always;
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;

    client_max_body_size 256M;

    location / {
        proxy_pass http://strapi;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
EOF
```

### 5.6 Nginx neu starten
```bash
docker compose restart nginx
```

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
https://api.florianbirkenberger.de/admin
```

**Ersten Admin-User erstellen:**
- First name, Last name
- Email
- Password (mind. 8 Zeichen)
- Klicke "Let's start"

### 6.4 API testen
```bash
curl https://api.florianbirkenberger.de/api/achievements
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

### 7.3 Logs überwachen
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

# Prüfe Credentials
docker compose exec postgres psql -U strapi -d strapi
```

### SSL-Zertifikat erneuern
```bash
# Stoppe nginx temporär
docker compose stop nginx

# Erneuere Zertifikat
certbot renew

# Kopiere neue Zertifikate
cp -rL /etc/letsencrypt/* certbot/conf/

# Starte nginx
docker compose up -d nginx
```

### Nginx startet nicht (SSL-Fehler)
```bash
# Prüfe nginx Logs
docker compose logs nginx --tail=20

# Falls SSL-Zertifikat fehlt, nutze HTTP-only Config temporär
cat > nginx/conf.d/strapi.conf << 'EOF'
upstream strapi {
    server strapi:1337;
}

server {
    listen 80;
    listen [::]:80;
    server_name api.florianbirkenberger.de;

    location / {
        proxy_pass http://strapi;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
EOF
docker compose restart nginx
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
                   │  Nginx  │ :80/:443
                   │ (Proxy) │
                   └────┬────┘
                        │
         ┌──────────────┼──────────────┐
         │              │              │
         ▼              ▼              ▼
    ┌─────────┐   ┌──────────┐   ┌──────────┐
    │ Strapi  │   │ Certbot  │   │ Uploads  │
    │  :1337  │   │  (SSL)   │   │ (Volume) │
    └────┬────┘   └──────────┘   └──────────┘
         │
         ▼
    ┌──────────┐
    │ Postgres │
    │  :5432   │
    └──────────┘
```

**URLs:**
- Admin Panel: `https://api.florianbirkenberger.de/admin`
- REST API: `https://api.florianbirkenberger.de/api/`
- Uploads: `https://api.florianbirkenberger.de/uploads/`
