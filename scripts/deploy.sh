#!/bin/bash
# ===========================================
# Strapi Deployment Script für Hostinger VPS
# ===========================================
# Nutzung: ./scripts/deploy.sh

set -e

echo "=== Strapi Deployment ==="

# Prüfe ob .env existiert
if [ ! -f .env ]; then
    echo "FEHLER: .env Datei nicht gefunden!"
    echo "Kopiere .env.production zu .env und passe die Werte an."
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
echo "Admin Panel: https://api.florianbirkenberger.de/admin"
echo ""
echo "Logs ansehen: docker-compose logs -f strapi"
