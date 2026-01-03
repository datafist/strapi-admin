#!/bin/bash
# ===========================================
# SSL-Zertifikat mit Let's Encrypt einrichten
# ===========================================
# Dieses Skript auf dem VPS ausführen!

set -e

DOMAIN="api.florianbirkenberger.de"
EMAIL="your-email@example.com"  # ÄNDERN!

echo "=== SSL-Zertifikat Setup für $DOMAIN ==="

# Erstelle notwendige Verzeichnisse
mkdir -p certbot/conf certbot/www

# Ersetze nginx config mit initial (nur HTTP)
cp nginx/conf.d/strapi-initial.conf.template nginx/conf.d/strapi.conf

# Starte nginx und strapi
echo "Starte Container..."
docker-compose up -d nginx strapi postgres

# Warte auf nginx
sleep 10

# Hole SSL-Zertifikat
echo "Hole SSL-Zertifikat..."
docker-compose run --rm certbot certonly \
    --webroot \
    --webroot-path=/var/www/certbot \
    --email $EMAIL \
    --agree-tos \
    --no-eff-email \
    -d $DOMAIN

# Ersetze mit vollständiger SSL-Konfiguration
echo "Aktiviere SSL-Konfiguration..."
cat > nginx/conf.d/strapi.conf << 'EOF'
# Strapi API - api.florianbirkenberger.de

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
    listen 443 ssl http2;
    listen [::]:443 ssl http2;
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

    location /admin {
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

    location /api {
        proxy_pass http://strapi;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    location /uploads {
        proxy_pass http://strapi;
        expires 7d;
        add_header Cache-Control "public, no-transform";
    }

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

# Starte nginx neu
echo "Starte nginx neu..."
docker-compose restart nginx

echo ""
echo "=== SSL-Setup abgeschlossen! ==="
echo "Deine Strapi-API ist jetzt erreichbar unter:"
echo "  https://$DOMAIN/admin"
echo ""
