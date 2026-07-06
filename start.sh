#!/bin/sh
# Entrypoint for Dockerfile.railway: runs migrations, then Gunicorn (Django,
# loopback-only) and the stale-booking-expiry loop in the background, and
# execs the Next.js standalone server in the foreground bound to Railway's
# $PORT so container lifecycle (signals, restarts) tracks that process.
set -e

cd /app/backend
python3 manage.py migrate --noinput
gunicorn config.wsgi:application --bind 127.0.0.1:8000 --workers 3 &

(while true; do sleep 300; python3 manage.py expire_stale_bookings; done) &

cd /app/frontend
export PORT="${PORT:-3000}"
exec node server.js
