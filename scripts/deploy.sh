#!/bin/bash
# ===========================================
# Strapi Deployment Script für Hostinger VPS
# ===========================================
# Nutzung: cd /opt/strapi-admin && ./scripts/deploy.sh

set -e

echo "=== Strapi Deployment ==="
echo "Aktuelles Verzeichnis: $(pwd)"

# Prüfe ob wir im richtigen Verzeichnis sind
if [ ! -f "docker-compose.yml" ]; then
    echo "FEHLER: docker-compose.yml nicht gefunden!"
    echo "Bitte führe dieses Skript im Projektordner aus:"
    echo "  cd /opt/strapi-admin && ./scripts/deploy.sh"
    exit 1
fi

# Prüfe ob .env existiert
if [ ! -f .env ]; then
    echo "FEHLER: .env Datei nicht gefunden!"
    echo "Kopiere .env.production zu .env und passe die Werte an:"
    echo "  cp .env.production .env"
    echo "  nano .env"
    exit 1
fi

# Stoppe alte Container
echo "Stoppe alte Container..."
docker-compose down

# Baue neues Image
echo "Baue Strapi Image..."
docker-compose build --no-cache strapi

# Starte alle Services
echo "Starte Services..."
docker-compose up -d

# Zeige Status
echo ""
echo "=== Container Status ==="
docker-compose ps

echo ""
echo "=== Logs (letzte 20 Zeilen) ==="
docker-compose logs --tail=20

echo ""
echo "=== Deployment abgeschlossen! ==="
echo "Admin Panel: https://strapi.florianbirkenberger.de/admin"
echo ""
echo "Logs ansehen: docker-compose logs -f strapi"
