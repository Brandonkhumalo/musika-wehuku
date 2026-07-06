#!/bin/sh
# Entrypoint for Dockerfile.railway: boots a local Postgres cluster (bundled in
# the image), runs migrations, then Gunicorn (Django, loopback-only) and the
# stale-booking-expiry loop in the background, and execs the Next.js standalone
# server in the foreground bound to Railway's $PORT so container lifecycle
# (signals, restarts) tracks that process.
#
# PGDATA lives at /var/lib/postgresql/data instead of the Debian package's
# default cluster path so a Railway volume mounted at that same path persists
# data across redeploys. We can't rely on pg_ctlcluster here: it manages the
# Debian-registered default cluster, which would be shadowed by the volume
# mount, so we initialize/start the cluster manually with initdb/pg_ctl.
set -e

PGDATA=/var/lib/postgresql/data
PG_BIN="/usr/lib/postgresql/$(ls /usr/lib/postgresql)/bin"

mkdir -p "$PGDATA" /var/run/postgresql
chown -R postgres:postgres "$PGDATA" /var/run/postgresql
chmod 700 "$PGDATA"

if [ ! -s "$PGDATA/PG_VERSION" ]; then
  su postgres -c "$PG_BIN/initdb -D $PGDATA --auth-local=peer --auth-host=scram-sha-256"
fi

su postgres -c "$PG_BIN/pg_ctl -D $PGDATA -l /var/log/postgresql.log -w -o '-c listen_addresses=127.0.0.1 -c port=5432' start"

until su postgres -c "pg_isready -q -h 127.0.0.1"; do sleep 1; done

DB_NAME="${DB_NAME:-musikawehuku}"
DB_USER="${DB_USER:-musikawehuku}"
DB_PASSWORD="${DB_PASSWORD:-musikawehuku_docker}"

su postgres -c "createuser $DB_USER" 2>/dev/null || true
su postgres -c "psql -c \"ALTER ROLE $DB_USER WITH LOGIN PASSWORD '$DB_PASSWORD';\""
su postgres -c "createdb -O $DB_USER $DB_NAME" 2>/dev/null || true

cd /app/backend
python3 manage.py migrate --noinput
python3 manage.py seed_demo_collection_point
gunicorn config.wsgi:application --bind 127.0.0.1:8000 --workers 3 &

(while true; do sleep 300; python3 manage.py expire_stale_bookings; done) &

cd /app/frontend
export PORT="${PORT:-3000}"
# Docker auto-sets HOSTNAME to the container ID; Next's standalone server binds
# to that literal value if present, which Railway's edge can't reach. Force it
# to listen on all interfaces instead.
export HOSTNAME=0.0.0.0
exec node server.js
