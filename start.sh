#!/bin/sh
# Entrypoint for Dockerfile.railway: boots a local Postgres cluster (bundled in
# the image for testing only — no persistent volume, data resets each redeploy),
# runs migrations, then Gunicorn (Django, loopback-only) and the stale-booking-
# expiry loop in the background, and execs the Next.js standalone server in the
# foreground bound to Railway's $PORT so container lifecycle (signals, restarts)
# tracks that process.
set -e

PG_VERSION=$(ls /etc/postgresql)
pg_ctlcluster "$PG_VERSION" main start

until su postgres -c "pg_isready -q"; do sleep 1; done

DB_NAME="${DB_NAME:-musikawehuku}"
DB_USER="${DB_USER:-musikawehuku}"
DB_PASSWORD="${DB_PASSWORD:-musikawehuku_docker}"

su postgres -c "createuser $DB_USER" 2>/dev/null || true
su postgres -c "psql -c \"ALTER ROLE $DB_USER WITH LOGIN PASSWORD '$DB_PASSWORD';\""
su postgres -c "createdb -O $DB_USER $DB_NAME" 2>/dev/null || true

cd /app/backend
python3 manage.py migrate --noinput
gunicorn config.wsgi:application --bind 127.0.0.1:8000 --workers 3 &

(while true; do sleep 300; python3 manage.py expire_stale_bookings; done) &

cd /app/frontend
export PORT="${PORT:-3000}"
# Docker auto-sets HOSTNAME to the container ID; Next's standalone server binds
# to that literal value if present, which Railway's edge can't reach. Force it
# to listen on all interfaces instead.
export HOSTNAME=0.0.0.0
exec node server.js
