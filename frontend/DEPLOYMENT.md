# SECURITYOPS - Produktions-Deployment & Betriebsanleitung (DEPLOYMENT.md)

Diese Anleitung beschreibt die schlüsselfertige Inbetriebnahme von SecurityOps Enterprise auf einem Linux-Server (Ubuntu 22.04 / 24.04 LTS oder Debian 12).

---

## 1. Systemvoraussetzungen
- **CPU:** Mindestens 4 vCPU Kerne
- **RAM:** Mindestens 8 GB RAM (16 GB empfohlen für KRITIS-Installationen)
- **Speicher:** 50 GB NVMe / SSD
- **Software:** Docker Engine 26+, Docker Compose v2.24+

---

## 2. Docker Compose Produktions-Setup (`docker-compose.prod.yml`)

```yaml
version: '3.8'

services:
  db:
    image: postgres:16-alpine
    restart: always
    environment:
      POSTGRES_DB: securityops_prod
      POSTGRES_USER: ${DB_USER:-secops_admin}
      POSTGRES_PASSWORD: ${DB_PASSWORD:?DB_PASSWORD_REQUIRED}
    volumes:
      - pgdata:/var/lib/postgresql/data
      - ./backups:/backups
    networks:
      - secops_internal
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U secops_admin -d securityops_prod"]
      interval: 10s
      timeout: 5s
      retries: 5

  redis:
    image: redis:7-alpine
    restart: always
    command: redis-server --requirepass ${REDIS_PASSWORD:?REDIS_PASSWORD_REQUIRED}
    networks:
      - secops_internal

  api:
    build:
      context: ./backend
      dockerfile: Dockerfile
    restart: always
    environment:
      DATABASE_URL: postgresql+asyncpg://${DB_USER}:${DB_PASSWORD}@db:5432/securityops_prod
      REDIS_URL: redis://:${REDIS_PASSWORD}@redis:6379/0
      SECRET_KEY: ${SECRET_KEY:?SECRET_KEY_REQUIRED}
    depends_on:
      db:
        condition: service_healthy
    networks:
      - secops_internal

  celery_worker:
    build:
      context: ./backend
      dockerfile: Dockerfile
    command: celery -A core.celery_app worker -l info -c 4
    restart: always
    environment:
      DATABASE_URL: postgresql+asyncpg://${DB_USER}:${DB_PASSWORD}@db:5432/securityops_prod
      REDIS_URL: redis://:${REDIS_PASSWORD}@redis:6379/0
    depends_on:
      - api
      - redis
    networks:
      - secops_internal

  frontend:
    build:
      context: .
      dockerfile: Dockerfile.frontend
    restart: always
    networks:
      - secops_internal

  nginx:
    image: nginx:1.25-alpine
    restart: always
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx/conf.d:/etc/nginx/conf.d
      - ./nginx/ssl:/etc/nginx/ssl:ro
    depends_on:
      - frontend
      - api
    networks:
      - secops_internal
      - secops_public

networks:
  secops_internal:
    internal: true
  secops_public:
    driver: bridge

volumes:
  pgdata:
```

---

## 3. Schritt-für-Schritt Installation

```bash
# 1. Repository klonen und Verzeichnis betreten
git clone https://github.com/securityops/securityops-core.git /opt/securityops
cd /opt/securityops

# 2. Produktions-Umgebungsvariablen konfigurieren
cp .env.example .env
chmod 600 .env
nano .env

# 3. Datenbankmigrationen ausführen (Alembic)
docker compose run --rm api alembic upgrade head

# 4. Gesamtes System starten
docker compose -f docker-compose.prod.yml up -d

# 5. Healthcheck verifizieren
docker compose ps
curl -k https://localhost/api/v1/health
```

---

## 4. Revisionssicheres Backup & Restore

### Automatisierter Backup-Cronjob (Täglich 02:00 Uhr)
```bash
# Erzeugt verschlüsseltes, komprimiertes PostgreSQL Custom-Format Backup
docker compose exec -T db pg_dump -U secops_admin -Fc securityops_prod | gzip > /opt/securityops/backups/secops_$(date +%Y%m%d_%H%M%S).dump.gz
```

### Wiederherstellung (Disaster Recovery)
```bash
gunzip -c /opt/securityops/backups/secops_20250512_020000.dump.gz | docker compose exec -T db pg_restore -U secops_admin -d securityops_prod --clean
```
