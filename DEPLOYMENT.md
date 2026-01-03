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

### Option A: Über Vercel Dashboard (empfohlen)
1. Gehe zu https://vercel.com
2. Klicke "Add New Project"
3. Importiere dein GitHub-Repository
4. Konfiguriere:
   - **Framework Preset**: Other
   - **Build Command**: `npm run build`
   - **Output Directory**: `build` (leer lassen)
   - **Install Command**: `npm install`

5. **Environment Variables** hinzufügen (WICHTIG!):
   ```
   NODE_ENV=production
   DATABASE_CLIENT=postgres
   DATABASE_URL=postgresql://postgres:[PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres
   DATABASE_SSL=true
   DATABASE_SSL_REJECT_UNAUTHORIZED=false
   
   APP_KEYS=generiere-neue-schlüssel
   API_TOKEN_SALT=generiere-neue-schlüssel
   ADMIN_JWT_SECRET=generiere-neue-schlüssel
   TRANSFER_TOKEN_SALT=generiere-neue-schlüssel
   ENCRYPTION_KEY=generiere-neue-schlüssel
   JWT_SECRET=generiere-neue-schlüssel
   ```

   **Neue Schlüssel generieren** (lokal ausführen):
   ```bash
   node -e "console.log(require('crypto').randomBytes(16).toString('base64'))"
   ```

6. Klicke "Deploy"

### Option B: Über Vercel CLI
```bash
npm i -g vercel
vercel login
vercel --prod
```

## 5. Nach dem Deployment

1. **Admin-User erstellen**:
   - Öffne: `https://your-app.vercel.app/admin`
   - Erstelle ersten Admin-User

2. **API testen**:
   - REST API: `https://your-app.vercel.app/api/achievements`
   - GraphQL: `https://your-app.vercel.app/graphql`

3. **Logs überprüfen**:
   - Vercel Dashboard → Dein Projekt → Logs

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
