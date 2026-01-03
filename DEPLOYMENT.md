# Strapi 5 Deployment auf Railway mit PostgreSQL

## 1. Projekt für Railway vorbereiten

### PostgreSQL-Abhängigkeit installieren:
```bash
npm install pg
```

**Optional für lokale Entwicklung mit SQLite:**
```bash
npm install better-sqlite3
```

### GitHub Repository vorbereiten

1. **Änderungen committen**:
```bash
git add .
git commit -m "Prepare for Railway deployment"
git push origin main
```

2. **Prüfen Sie .gitignore** (sollte enthalten):
```
.env
.env.production
.env.railway
node_modules
.tmp
.cache
build
dist
.strapi
*.db
```

## 2. Railway Deployment - Schritt für Schritt

### Schritt 1: Railway-Account erstellen
1. Gehe zu https://railway.app
2. Klicke **"Start a New Project"** oder **"Login with GitHub"**
3. Autorisiere Railway für GitHub-Zugriff
4. Du landest im Railway-Dashboard

### Schritt 2: Neues Projekt erstellen

1. Klicke im Dashboard auf **"+ New Project"**
2. Wähle **"Deploy from GitHub repo"**
3. Suche nach deinem Repository `strapi-admin`
4. Klicke auf das Repository zum Auswählen
5. Railway beginnt automatisch mit dem ersten Deployment

**WICHTIG**: Dieses erste Deployment wird fehlschlagen - das ist normal! Wir müssen erst die Datenbank und Umgebungsvariablen hinzufügen.

### Schritt 3: PostgreSQL-Datenbank hinzufügen

1. Im Projekt-Dashboard siehst du dein Strapi-Service (grünes Rechteck)
2. Klicke oben rechts auf **"+ New"**
3. Wähle **"Database"**
4. Klicke **"Add PostgreSQL"**
5. Railway erstellt eine PostgreSQL-Instanz und verknüpft sie automatisch

**Railway macht automatisch**:
- Erstellt eine PostgreSQL-Datenbank
- Generiert Zugangsdaten
- Setzt die Umgebungsvariable `DATABASE_URL` in deinem Strapi-Service

**Verknüpfung prüfen**:
1. Klicke auf dein **Strapi-Service** (nicht die Datenbank)
2. Gehe zum Tab **"Variables"**
3. Du solltest `DATABASE_URL` bereits in der Liste sehen (automatisch hinzugefügt)

### Schritt 4: Umgebungsvariablen setzen - DETAILLIERT

#### 4.1 Secrets lokal generieren
Öffne dein Terminal lokal und generiere **6 zufällige Schlüssel**:

```bash
# Führe diesen Befehl 6 Mal aus:
node -e "console.log(require('crypto').randomBytes(16).toString('base64'))"
```

Beispiel-Output jedes Mal:
```
XyZ123abc456def789==
```

Kopiere alle 6 generierten Werte in eine Notiz.

#### 4.2 Variablen in Railway eintragen

1. Klicke auf dein **Strapi-Service** (grünes Rechteck)
2. Klicke auf den Tab **"Variables"**
3. Du siehst bereits `DATABASE_URL` (von PostgreSQL)

**Trage nun folgende Variablen ein (eine nach der anderen):**

---

**Variable 1: NODE_ENV**
- Klicke **"+ New Variable"** (oben rechts)
- **Variable Name**: `NODE_ENV`
- **Value**: `production`
- Klicke **"Add"**

---

**Variable 2: DATABASE_CLIENT**
- Klicke **"+ New Variable"**
- **Variable Name**: `DATABASE_CLIENT`
- **Value**: `postgres`
- Klicke **"Add"**

---

**Variable 3: APP_KEYS**
- Klicke **"+ New Variable"**
- **Variable Name**: `APP_KEYS`
- **Value**: [Dein 1. generierter Schlüssel]
- Klicke **"Add"**

---

**Variable 4: API_TOKEN_SALT**
- Klicke **"+ New Variable"**
- **Variable Name**: `API_TOKEN_SALT`
- **Value**: [Dein 2. generierter Schlüssel]
- Klicke **"Add"**

---

**Variable 5: ADMIN_JWT_SECRET**
- Klicke **"+ New Variable"**
- **Variable Name**: `ADMIN_JWT_SECRET`
- **Value**: [Dein 3. generierter Schlüssel]
- Klicke **"Add"**

---

**Variable 6: TRANSFER_TOKEN_SALT**
- Klicke **"+ New Variable"**
- **Variable Name**: `TRANSFER_TOKEN_SALT`
- **Value**: [Dein 4. generierter Schlüssel]
- Klicke **"Add"**

---

**Variable 7: ENCRYPTION_KEY**
- Klicke **"+ New Variable"**
- **Variable Name**: `ENCRYPTION_KEY`
- **Value**: [Dein 5. generierter Schlüssel]
- Klicke **"Add"**

---

**Variable 8: JWT_SECRET**
- Klicke **"+ New Variable"**
- **Variable Name**: `JWT_SECRET`
- **Value**: [Dein 6. generierter Schlüssel]
- Klicke **"Add"**

---

#### 4.3 Variablen-Checkliste

Du solltest jetzt **9 Umgebungsvariablen** haben:
- ✅ `DATABASE_URL` (automatisch von Railway)
- ✅ `NODE_ENV`
- ✅ `DATABASE_CLIENT`
- ✅ `APP_KEYS`
- ✅ `API_TOKEN_SALT`
- ✅ `ADMIN_JWT_SECRET`
- ✅ `TRANSFER_TOKEN_SALT`
- ✅ `ENCRYPTION_KEY`
- ✅ `JWT_SECRET`

---

### Schritt 5: Deployment-Einstellungen überprüfen

1. Klicke auf dein Strapi-Service
2. Gehe zum Tab **"Settings"**
3. Scrolle zu **"Deploy"**

**Prüfe folgende Einstellungen**:
- **Build Command**: Sollte `npm run build` sein (automatisch erkannt)
- **Start Command**: Sollte `npm run start` sein (automatisch erkannt)
- **Root Directory**: Sollte `/` sein

**Falls nicht korrekt**:
- Bei **Custom Build Command**: `npm install && npm run build`
- Bei **Custom Start Command**: `npm run start`

---

### Schritt 6: Deployment neu starten

1. Gehe zum Tab **"Deployments"**
2. Das erste Deployment ist wahrscheinlich fehlgeschlagen (rot)
3. Klicke oben rechts auf **"Deploy"** oder warte auf Auto-Redeploy
4. Railway startet ein neues Deployment mit allen Umgebungsvariablen

**Logs in Echtzeit ansehen**:
1. Klicke auf das laufende Deployment
2. Sieh dir die Logs an:
   - **Building**: npm install, npm run build
   - **Deploying**: npm run start, Strapi-Initialisierung
3. Warte bis du siehst:
   ```
   [YYYY-MM-DD HH:MM:SS.SSS] info: Server started on http://0.0.0.0:XXXX
   ```

**Deployment dauert ca. 3-5 Minuten.**

---

### Schritt 7: Domain/URL erhalten

1. Gehe zurück zu deinem Strapi-Service
2. Klicke auf den Tab **"Settings"**
3. Scrolle zu **"Networking"** oder **"Public Networking"**
4. Klicke **"Generate Domain"**
5. Railway generiert eine URL wie:
   ```
   strapi-admin-production-a1b2.up.railway.app
   ```
6. Diese URL ist öffentlich erreichbar

**Optional: Custom Domain**:
- Klicke **"Custom Domain"**
- Füge deine Domain hinzu (z.B. `api.deinedomain.de`)
- Folge den DNS-Anweisungen

---

### Schritt 8: Admin-Panel öffnen und testen

1. **Öffne die Admin-URL**:
   ```
   https://strapi-admin-production-a1b2.up.railway.app/admin
   ```

2. **Ersten Admin-User erstellen**:
   - Du siehst das Registrierungsformular
   - Fülle aus:
     - First name
     - Last name
     - Email
     - Password (mind. 8 Zeichen)
   - Klicke **"Let's start"**

3. **API testen**:
   - REST API: `https://strapi-admin-production-a1b2.up.railway.app/api/achievements`
   - Admin Panel: `https://strapi-admin-production-a1b2.up.railway.app/admin`

---

### Schritt 9: Automatische Deployments (Continuous Deployment)

**Ab jetzt**: Jeder `git push` zu deinem GitHub-Repository triggert automatisch ein neues Deployment auf Railway!

**Workflow**:
1. Lokal Änderungen machen
2. `git add .`
3. `git commit -m "Update"`
4. `git push origin main`
5. Railway baut und deployt automatisch
6. Du siehst neues Deployment im **Deployments**-Tab

---

### Schritt 10: Logs und Monitoring

**Logs ansehen**:
1. Klicke auf dein Strapi-Service
2. Gehe zum Tab **"Deployments"**
3. Klicke auf ein Deployment → Siehst Build + Runtime Logs

**Oder Live-Logs**:
1. Klicke auf dein Service
2. Oben rechts: **"View Logs"**
3. Siehst Live-Stream der Logs

**Metriken**:
1. Gehe zum Tab **"Metrics"**
2. Siehst CPU, Memory, Network Usage

---

### Railway Kosten & Limits (Stand 2026)

**Free Tier**:
- $5 Startguthaben pro Monat
- Unbegrenzte Projekte
- 500 Stunden Laufzeit/Monat
- 100 GB Bandbreite
- 1 GB RAM pro Service

**Für Strapi typisch**:
- ~$3-5/Monat bei geringem Traffic
- PostgreSQL-Datenbank: ~$1-2/Monat

**Upgrade auf Pro** (falls nötig):
- $20/Monat
- Mehr RAM, CPU, Bandbreite

---

**Variable 1: NODE_ENV**
- Klicke **"+ New Variable"** (oben rechts)
- **Variable Name**: `NODE_ENV`
- **Value**: `production`
- Klicke **"Add"**

---

**Variable 2: DATABASE_CLIENT**
- Klicke **"+ New Variable"**
- **Variable Name**: `DATABASE_CLIENT`
- **Value**: `postgres`
- Klicke **"Add"**

---

**Variable 3: APP_KEYS**
- Klicke **"+ New Variable"**
- **Variable Name**: `APP_KEYS`
- **Value**: [Dein 1. generierter Schlüssel]
- Klicke **"Add"**

---

**Variable 4: API_TOKEN_SALT**
- Klicke **"+ New Variable"**
- **Variable Name**: `API_TOKEN_SALT`
- **Value**: [Dein 2. generierter Schlüssel]
- Klicke **"Add"**

---

**Variable 5: ADMIN_JWT_SECRET**
- Klicke **"+ New Variable"**
- **Variable Name**: `ADMIN_JWT_SECRET`
- **Value**: [Dein 3. generierter Schlüssel]
- Klicke **"Add"**

---

**Variable 6: TRANSFER_TOKEN_SALT**
- Klicke **"+ New Variable"**
- **Variable Name**: `TRANSFER_TOKEN_SALT`
- **Value**: [Dein 4. generierter Schlüssel]
- Klicke **"Add"**

---

**Variable 7: ENCRYPTION_KEY**
- Klicke **"+ New Variable"**
- **Variable Name**: `ENCRYPTION_KEY`
- **Value**: [Dein 5. generierter Schlüssel]
- Klicke **"Add"**

---

**Variable 8: JWT_SECRET**
- Klicke **"+ New Variable"**
- **Variable Name**: `JWT_SECRET`
- **Value**: [Dein 6. generierter Schlüssel]
- Klicke **"Add"**

---

#### 4.3 Variablen-Checkliste

Du solltest jetzt **9 Umgebungsvariablen** haben:
- ✅ `DATABASE_URL` (automatisch von Railway)
- ✅ `NODE_ENV`
- ✅ `DATABASE_CLIENT`
- ✅ `APP_KEYS`
- ✅ `API_TOKEN_SALT`
- ✅ `ADMIN_JWT_SECRET`
- ✅ `TRANSFER_TOKEN_SALT`
- ✅ `ENCRYPTION_KEY`
- ✅ `JWT_SECRET`

---

### Schritt 5: Deployment-Einstellungen überprüfen

1. Klicke auf dein Strapi-Service
2. Gehe zum Tab **"Settings"**
3. Scrolle zu **"Deploy"**

**Prüfe folgende Einstellungen**:
- **Build Command**: Sollte `npm run build` sein (automatisch erkannt)
- **Start Command**: Sollte `npm run start` sein (automatisch erkannt)
- **Root Directory**: Sollte `/` sein

**Falls nicht korrekt**:
- Bei **Custom Build Command**: `npm install && npm run build`
- Bei **Custom Start Command**: `npm run start`

---

### Schritt 6: Deployment neu starten

1. Gehe zum Tab **"Deployments"**
2. Das erste Deployment ist wahrscheinlich fehlgeschlagen (rot)
3. Klicke oben rechts auf **"Deploy"** oder warte auf Auto-Redeploy
4. Railway startet ein neues Deployment mit allen Umgebungsvariablen

**Logs in Echtzeit ansehen**:
1. Klicke auf das laufende Deployment
2. Sieh dir die Logs an:
   - **Building**: npm install, npm run build
   - **Deploying**: npm run start, Strapi-Initialisierung
3. Warte bis du siehst:
   ```
   [YYYY-MM-DD HH:MM:SS.SSS] info: Server started on http://0.0.0.0:XXXX
   ```

**Deployment dauert ca. 3-5 Minuten.**

---

### Schritt 7: Domain/URL erhalten

1. Gehe zurück zu deinem Strapi-Service
2. Klicke auf den Tab **"Settings"**
3. Scrolle zu **"Networking"** oder **"Public Networking"**
4. Klicke **"Generate Domain"**
5. Railway generiert eine URL wie:
   ```
   strapi-admin-production-a1b2.up.railway.app
   ```
6. Diese URL ist öffentlich erreichbar

**Optional: Custom Domain**:
- Klicke **"Custom Domain"**
- Füge deine Domain hinzu (z.B. `api.deinedomain.de`)
- Folge den DNS-Anweisungen

---

### Schritt 8: Admin-Panel öffnen und testen

1. **Öffne die Admin-URL**:
   ```
   https://strapi-admin-production-a1b2.up.railway.app/admin
   ```

2. **Ersten Admin-User erstellen**:
   - Du siehst das Registrierungsformular
   - Fülle aus:
     - First name
     - Last name
     - Email
     - Password (mind. 8 Zeichen)
   - Klicke **"Let's start"**

3. **API testen**:
   - REST API: `https://strapi-admin-production-a1b2.up.railway.app/api/achievements`
   - Admin Panel: `https://strapi-admin-production-a1b2.up.railway.app/admin`

---

### Schritt 9: Automatische Deployments (Continuous Deployment)

**Ab jetzt**: Jeder `git push` zu deinem GitHub-Repository triggert automatisch ein neues Deployment auf Railway!

**Workflow**:
1. Lokal Änderungen machen
2. `git add .`
3. `git commit -m "Update"`
4. `git push origin main`
5. Railway baut und deployt automatisch
6. Du siehst neues Deployment im **Deployments**-Tab

---

### Schritt 10: Logs und Monitoring

**Logs ansehen**:
1. Klicke auf dein Strapi-Service
2. Gehe zum Tab **"Deployments"**
3. Klicke auf ein Deployment → Siehst Build + Runtime Logs

**Oder Live-Logs**:
1. Klicke auf dein Service
2. Oben rechts: **"View Logs"**
3. Siehst Live-Stream der Logs

**Metriken**:
1. Gehe zum Tab **"Metrics"**
2. Siehst CPU, Memory, Network Usage

---

### Railway Kosten & Limits (Stand 2026)

**Free Tier**:
- $5 Startguthaben pro Monat
- Unbegrenzte Projekte
- 500 Stunden Laufzeit/Monat
- 100 GB Bandbreite
- 1 GB RAM pro Service

**Für Strapi typisch**:
- ~$3-5/Monat bei geringem Traffic
- PostgreSQL-Datenbank: ~$1-2/Monat

**Upgrade auf Pro** (falls nötig):
- $20/Monat
- Mehr RAM, CPU, Bandbreite

## 6. Wichtige Hinweise

### Vercel Free Tier Limits:
- 10-Sekunden-Timeout für Serverless-Funktionen
- 100 GB Bandbreite/Monat
- Keine persistente Dateispeicherung (nutze Cloud-Storage für Uploads)

### Für Datei-Uploads:
Konfiguriere ein Upload-Provider-Plugin (z.B. AWS S3, Cloudinary) in `config/plugins.ts`:
```typescript
export default {
  upload: {
    config: {
      provider: 'cloudinary',
      providerOptions: {
        cloud_name: env('CLOUDINARY_NAME'),
        api_key: env('CLOUDINARY_KEY'),
        api_secret: env('CLOUDINARY_SECRET'),
      },
    },
  },
};
```

### Continuous Deployment:
- Jeder Push zu `main` triggert automatisch ein neues Deployment
- Preview-Deployments für Pull Requests

## 7. Troubleshooting

**Build-Fehler "Unsupported Node.js version"**:
- Erstelle `.nvmrc` im Root mit: `20.11.0`

**Timeout-Fehler**:
- Vercel Free Tier hat 10s Timeout
- Erwäge Heroku/Railway für längere Requests

**Datenbank-Connection-Fehler**:
- Prüfe DATABASE_URL in Vercel Dashboard
- SSL-Einstellungen: `DATABASE_SSL=true`, `DATABASE_SSL_REJECT_UNAUTHORIZED=false`

**Admin-Panel lädt nicht**:
- Prüfe ob alle Secrets gesetzt sind
- Build-Logs in Vercel überprüfen
