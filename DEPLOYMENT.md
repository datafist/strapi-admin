# Strapi 5 Deployment auf Vercel mit Supabase

## 1. Supabase PostgreSQL-Datenbank einrichten

1. **Kostenloses Supabase-Konto erstellen**: https://supabase.com
2. **Neues Projekt erstellen**:
   - Projektname wählen
   - Datenbank-Passwort notieren (wird für DATABASE_URL benötigt)
   - Region wählen (z.B. Frankfurt für DE)
3. **Connection String holen**:
   - Gehe zu: Settings → Database → Connection String
   - Wähle "URI" (nicht "Connection Pooling")
   - Format: `postgresql://postgres:[YOUR-PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres`

## 2. Projekt für Vercel vorbereiten

### PostgreSQL-Abhängigkeit installieren:
```bash
npm install pg
npm uninstall better-sqlite3
```

### Lokale .env anpassen (für Tests):
```env
DATABASE_CLIENT=postgres
DATABASE_URL=postgresql://postgres:[PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres
DATABASE_SSL=true
DATABASE_SSL_REJECT_UNAUTHORIZED=false
```

### Testen Sie lokal:
```bash
npm install
npm run build
npm run start
```

## 3. GitHub Repository vorbereiten

1. **Änderungen committen**:
```bash
git add .
git commit -m "Prepare for Vercel deployment with Supabase"
git push origin main
```

2. **Prüfen Sie .gitignore** (sollte enthalten):
```
.env
.env.production
node_modules
.tmp
.cache
build
dist
.strapi
*.db
```

## 4. Vercel Deployment

### Schritt 1: Projekt in Vercel importieren
1. Gehe zu https://vercel.com und logge dich ein
2. Klicke auf den Button **"Add New..."** (oben rechts) → **"Project"**
3. Wähle deinen GitHub-Account aus (ggf. musst du GitHub autorisieren)
4. Suche dein Repository `strapi-admin` in der Liste
5. Klicke auf **"Import"** neben dem Repository

### Schritt 2: Build-Einstellungen konfigurieren
Im "Configure Project"-Screen:

**Framework Preset:**
- Wähle **"Other"** (nicht Next.js, nicht Vite)

**Root Directory:**
- Lasse dies leer (`.` bedeutet Root)

**Build and Output Settings:**
- **Build Command**: `npm run build` (sollte automatisch erkannt werden)
- **Output Directory**: Lasse leer oder setze `.` 
- **Install Command**: `npm install` (Standard)

### Schritt 3: Umgebungsvariablen setzen - DETAILLIERTE ANLEITUNG

**WICHTIG**: Scrolle NICHT nach unten und klicke NICHT auf "Deploy"! Erst müssen die Umgebungsvariablen gesetzt werden.

#### 3.1 Secrets lokal generieren
Öffne ein Terminal lokal und generiere 6 zufällige Schlüssel:

```bash
# Im Terminal ausführen (kopiere jeden Output!)
node -e "console.log(require('crypto').randomBytes(16).toString('base64'))"
```

Führe diesen Befehl **6 Mal** aus und kopiere jeden generierten Schlüssel in eine Notiz. Beispiel-Output:
```
XyZ123abc456def789==
```

#### 3.2 Supabase Database URL holen
1. Gehe zu https://supabase.com → Dein Projekt
2. Klicke links auf **"Project Settings"** (Zahnrad-Icon)
3. Klicke auf **"Database"**
4. Scrolle zu **"Connection String"**
5. Wähle den Tab **"URI"** (NICHT "Connection Pooling"!)
6. Kopiere die Connection String. Sie sieht so aus:
   ```
   postgresql://postgres.abcdefgh:[YOUR-PASSWORD]@aws-0-eu-central-1.pooler.supabase.com:5432/postgres
   ```
7. **WICHTIG**: Ersetze `[YOUR-PASSWORD]` mit dem Passwort, das du beim Erstellen des Supabase-Projekts gewählt hast

#### 3.3 Variablen in Vercel eingeben
Im "Configure Project"-Screen von Vercel:

1. Scrolle zum Abschnitt **"Environment Variables"**
2. Du siehst 3 Felder: **Key** | **Value** | **Environments**

**Trage folgende Variablen EINE NACH DER ANDEREN ein:**

---

**Variable 1: NODE_ENV**
- **Key**: `NODE_ENV`
- **Value**: `production`
- **Environments**: ✅ Production, ✅ Preview, ✅ Development (alle anhaken)
- Klicke auf **"Add"**

---

**Variable 2: DATABASE_CLIENT**
- **Key**: `DATABASE_CLIENT`
- **Value**: `postgres`
- **Environments**: ✅ Production, ✅ Preview, ✅ Development
- Klicke auf **"Add"**

---

**Variable 3: DATABASE_URL** ⚠️ WICHTIGSTE VARIABLE
- **Key**: `DATABASE_URL`
- **Value**: Füge deine komplette Supabase Connection String ein, z.B.:
  ```
  postgresql://postgres.abcdefgh:deinPasswort123@aws-0-eu-central-1.pooler.supabase.com:5432/postgres
  ```
- **Environments**: ✅ Production, ✅ Preview, ✅ Development
- Klicke auf **"Add"**

---

**Variable 4: DATABASE_SSL**
- **Key**: `DATABASE_SSL`
- **Value**: `true`
- **Environments**: ✅ Production, ✅ Preview, ✅ Development
- Klicke auf **"Add"**

---

**Variable 5: DATABASE_SSL_REJECT_UNAUTHORIZED**
- **Key**: `DATABASE_SSL_REJECT_UNAUTHORIZED`
- **Value**: `false`
- **Environments**: ✅ Production, ✅ Preview, ✅ Development
- Klicke auf **"Add"**

---

**Variable 6: APP_KEYS**
- **Key**: `APP_KEYS`
- **Value**: Füge deinen ersten generierten Schlüssel ein (aus Schritt 3.1), z.B.:
  ```
  XyZ123abc456def789==
  ```
- **Environments**: ✅ Production, ✅ Preview, ✅ Development
- Klicke auf **"Add"**

---

**Variable 7: API_TOKEN_SALT**
- **Key**: `API_TOKEN_SALT`
- **Value**: Füge deinen zweiten generierten Schlüssel ein
- **Environments**: ✅ Production, ✅ Preview, ✅ Development
- Klicke auf **"Add"**

---

**Variable 8: ADMIN_JWT_SECRET**
- **Key**: `ADMIN_JWT_SECRET`
- **Value**: Füge deinen dritten generierten Schlüssel ein
- **Environments**: ✅ Production, ✅ Preview, ✅ Development
- Klicke auf **"Add"**

---

**Variable 9: TRANSFER_TOKEN_SALT**
- **Key**: `TRANSFER_TOKEN_SALT`
- **Value**: Füge deinen vierten generierten Schlüssel ein
- **Environments**: ✅ Production, ✅ Preview, ✅ Development
- Klicke auf **"Add"**

---

**Variable 10: ENCRYPTION_KEY**
- **Key**: `ENCRYPTION_KEY`
- **Value**: Füge deinen fünften generierten Schlüssel ein
- **Environments**: ✅ Production, ✅ Preview, ✅ Development
- Klicke auf **"Add"**

---

**Variable 11: JWT_SECRET**
- **Key**: `JWT_SECRET`
- **Value**: Füge deinen sechsten generierten Schlüssel ein
- **Environments**: ✅ Production, ✅ Preview, ✅ Development
- Klicke auf **"Add"**

---

#### 3.4 Umgebungsvariablen überprüfen
Nach dem Hinzufügen solltest du **11 Umgebungsvariablen** in der Liste sehen:
- NODE_ENV
- DATABASE_CLIENT
- DATABASE_URL
- DATABASE_SSL
- DATABASE_SSL_REJECT_UNAUTHORIZED
- APP_KEYS
- API_TOKEN_SALT
- ADMIN_JWT_SECRET
- TRANSFER_TOKEN_SALT
- ENCRYPTION_KEY
- JWT_SECRET

### Schritt 4: Deployment starten
1. Scrolle nach unten
2. Klicke auf den blauen Button **"Deploy"**
3. Warte 2-5 Minuten während Vercel das Projekt baut

### Schritt 5: Umgebungsvariablen nachträglich bearbeiten (falls nötig)
Falls du Variablen vergessen hast oder ändern möchtest:

1. Gehe zu deinem Projekt-Dashboard auf Vercel
2. Klicke oben auf den Tab **"Settings"**
3. Klicke links im Menü auf **"Environment Variables"**
4. Hier siehst du alle gesetzten Variablen
5. Um eine Variable zu bearbeiten:
   - Klicke auf die drei Punkte **"..."** rechts neben der Variable
   - Wähle **"Edit"**
   - Ändere den Wert
   - Klicke **"Save"**
6. Um eine neue Variable hinzuzufügen:
   - Scrolle nach unten
   - Füge Key und Value ein
   - Wähle Environments aus
   - Klicke **"Save"**
7. **WICHTIG**: Nach Änderungen musst du ein **Redeploy** machen:
   - Gehe zum Tab **"Deployments"**
   - Klicke auf die drei Punkte beim neuesten Deployment
   - Wähle **"Redeploy"**

### Option B: Über Vercel CLI (Alternative)
Falls du die CLI bevorzugst:

```bash
npm i -g vercel
vercel login
vercel
# Folge den Prompts und setze Umgebungsvariablen wenn gefragt
```

**Umgebungsvariablen über CLI setzen:**
```bash
vercel env add NODE_ENV production
vercel env add DATABASE_CLIENT postgres
vercel env add DATABASE_URL
# ... usw. für alle Variablen
```

## 5. Nach dem Deployment - Fehlersuche

### Deployment-Logs überprüfen
1. Gehe zu deinem Vercel-Projekt
2. Klicke auf den Tab **"Deployments"**
3. Klicke auf das neueste Deployment
4. Klicke auf **"Building"** → Zeigt Build-Logs
5. Klicke auf **"Functions"** → Zeigt Runtime-Logs
6. Suche nach Fehlern (rot markiert)

### Häufige Probleme:

**Problem 1: 404 NOT_FOUND**
- **Ursache**: Strapi ist nicht korrekt gestartet oder vercel.json falsch konfiguriert
- **Lösung**: Prüfe Function Logs auf Fehler beim Strapi-Start
- **Alternative**: Vercel ist nicht ideal für Strapi (siehe unten)

**Problem 2: Datenbank-Tabellen werden nicht erstellt**
- **Ursache**: Strapi konnte sich nicht mit Supabase verbinden oder ist nicht gestartet
- **Lösung 1**: Überprüfe DATABASE_URL in Vercel Environment Variables
  - Format: `postgresql://postgres.xxxxx:[PASSWORD]@aws-0-eu-central-1.pooler.supabase.com:5432/postgres`
  - Ersetze `[PASSWORD]` mit deinem echten Passwort
  - Teste die Connection:
    ```bash
    # Lokal testen
    psql "postgresql://postgres.xxxxx:[PASSWORD]@aws-0-eu-central-1.pooler.supabase.com:5432/postgres"
    ```
- **Lösung 2**: In Supabase SQL Editor ausführen, um Tabellen zu sehen:
  ```sql
  SELECT table_name 
  FROM information_schema.tables 
  WHERE table_schema = 'public';
  ```
- **Lösung 3**: Strapi erstellt Tabellen beim ersten erfolgreichen Start automatisch

**Problem 3: Function Timeout (10 Sekunden)**
- **Ursache**: Vercel Free Tier hat 10s Timeout, Strapi braucht länger zum Starten
- **Lösung**: Siehe "Alternative zu Vercel" unten

### Wenn es funktioniert:
1. **Admin-User erstellen**:
   - Öffne: `https://your-app.vercel.app/admin`
   - Erstelle ersten Admin-User

2. **API testen**:
   - REST API: `https://your-app.vercel.app/api/achievements`
   - GraphQL: `https://your-app.vercel.app/graphql`

## 5a. Railway.app Deployment (EMPFOHLEN für Strapi)

**Warum Railway statt Vercel?**
- ✅ Persistente Container (kein Serverless-Timeout)
- ✅ Kostenloser Tier mit $5 Startguthaben/Monat
- ✅ Integrierte PostgreSQL-Datenbank (kein Supabase nötig)
- ✅ Perfekt für Node.js Backend-Apps wie Strapi
- ✅ Automatische Deployments via GitHub
- ✅ Einfachere Konfiguration als Vercel

---

### Schritt 1: Railway-Account erstellen

1. Gehe zu https://railway.app
2. Klicke **"Start a New Project"** oder **"Login with GitHub"**
3. Autorisiere Railway für GitHub-Zugriff
4. Du landest im Railway-Dashboard

---

### Schritt 2: Neues Projekt erstellen

1. Klicke im Dashboard auf **"+ New Project"**
2. Wähle **"Deploy from GitHub repo"**
3. Suche nach deinem Repository `strapi-admin`
4. Klicke auf das Repository zum Auswählen
5. Railway beginnt automatisch mit dem ersten Deployment

**WICHTIG**: Dieses erste Deployment wird fehlschlagen - das ist normal! Wir müssen erst die Datenbank und Umgebungsvariablen hinzufügen.

---

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

---

### Schritt 4: Umgebungsvariablen setzen - DETAILLIERT

#### 4.1 Secrets generieren (lokal)

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
