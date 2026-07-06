# Musika WeHuku

Digital poultry marketplace and reservation platform. Hatcheries list day-old chick batches;
farmers/agro-dealers browse, reserve, and pay a deposit or full amount; Elite Breeds &
Hatcheries branches act as collection points where staff verify payment and confirm handover.

## Architecture

- **Backend**: Django + Django REST Framework (monolith, one project/many apps), PostgreSQL,
  SimpleJWT auth. Booking creation is concurrency-safe (`select_for_update`) so two buyers can
  never reserve the same chicks.
- **Frontend**: Next.js (App Router) + TypeScript + Tailwind CSS. Three portals in one app:
  the public marketplace/buyer flow, `/seller/*` for hatcheries, `/staff/*` for Elite Breeds ops.
  A route-handler layer (`src/app/api/`) proxies to Django and keeps JWTs in httpOnly cookies.
- **Single origin**: Next.js internally proxies `/api/*` (with auth) and rewrites `/media/*` to
  Django, so there's one public URL for the whole system either way. In the docker-compose path
  below, Nginx is the public entry point in front of Next.js; on Railway (see the Railway section
  further down), the platform's own edge plays that role instead, so there's no Nginx in the
  container.

```
apps/
  backend/    Django project (accounts, warehouses, listings, bookings, payments, finance, dashboard)
  frontend/   Next.js app
  nginx/      reverse proxy config
  docker-compose.yml
```

## Local development

### Backend

```bash
cd backend
python3 -m venv venv && source venv/bin/activate
pip install -r requirements.txt

# start a local Postgres (or point DB_HOST/DB_* in .env at your own instance)
docker run -d --name musikawehuku-db -e POSTGRES_DB=musikawehuku \
  -e POSTGRES_USER=musikawehuku -e POSTGRES_PASSWORD=musikawehuku \
  -p 5432:5432 postgres:16

cp .env.example .env   # if present, or create one — see config/settings.py for keys
python manage.py migrate
python manage.py createsuperuser
python manage.py runserver 0.0.0.0:8000
```

Run tests with:

```bash
python manage.py test
```

### Frontend

```bash
cd frontend
npm install
echo "BACKEND_INTERNAL_URL=http://localhost:8000" > .env.local
npm run dev
```

Visit http://localhost:3000. In dev, the frontend talks to Django directly at
`BACKEND_INTERNAL_URL`; in production both are reached through the single Nginx origin.

### Stale booking expiry

Bookings that never get their payment proof approved hold stock for `BOOKING_HOLD_HOURS`
(default 48h). Release expired holds with:

```bash
python manage.py expire_stale_bookings
```

Run this on a schedule (cron, or the `booking-expiry` service in `docker-compose.yml`, which
loops every 5 minutes).

## Deployment (single server)

```bash
cp .env.example .env   # fill in DJANGO_SECRET_KEY, DB_PASSWORD, DJANGO_ALLOWED_HOSTS, etc.
docker compose up -d --build
docker compose exec backend python manage.py createsuperuser
```

This brings up Postgres, Django (Gunicorn), Next.js (standalone server), Nginx, and the booking
expiry loop, all on one Docker network, reachable at `http://<server>/`. Add TLS by terminating
HTTPS in the `nginx` service (e.g. via certbot) once a domain points at the server — then set
`COOKIE_SECURE=true` in `.env` and restart the `frontend` service, or login sessions will keep
working over HTTP but auth cookies won't get the `Secure` flag they should have.

## Deployment (Railway, single service)

`Dockerfile.railway` builds Django, Next.js, *and* Postgres into one image and runs all three
with `start.sh`: Postgres on loopback `127.0.0.1:5432` (initialized on first boot), Gunicorn on
loopback `127.0.0.1:8000`, and Next.js on Railway's `$PORT`. Everything lives in one Railway
service — no separate database service, no nginx (Railway's edge terminates TLS and proxies
straight to the container; Next.js already proxies `/api/*` and `/media/*` to Django internally).
This is a demo-grade shortcut: Postgres restarting inside an app container instead of its own
managed service means a redeploy can briefly interrupt the database, and it's on you to attach a
volume (below) or lose all data on the next deploy.

1. **Service** — "+ New" → "GitHub Repo" (or empty service + deploy from this repo), then in
   Settings → Build set **Dockerfile Path** to `Dockerfile.railway` and **Root Directory** to the
   repo root (the build needs `backend/` and `frontend/` as context).
2. **Volume** — Settings → Volumes → add one mounted at `/var/lib/postgresql/data`. Without this,
   every redeploy wipes the database (`start.sh` re-runs `initdb` whenever that path is empty).
3. **Env vars**:
   - `DJANGO_SECRET_KEY`, `DJANGO_DEBUG=False`
   - `DJANGO_ALLOWED_HOSTS=<your-app>.up.railway.app,127.0.0.1,localhost`
   - `DB_NAME`, `DB_USER`, `DB_PASSWORD` — `start.sh` creates this role/database on first boot
     using these same values, so just pick a real password; no separate DB service to match it to.
     (`DB_HOST`/`DB_PORT` don't need to be set — Django already defaults to `localhost`/`5432`.)
   - `CORS_ALLOWED_ORIGINS=https://<your-app>.up.railway.app`
   - `COOKIE_SECURE=true` (Railway terminates TLS at the edge, so this is safe from the start —
     unlike the docker-compose path above, there's no HTTP-only bootstrapping phase)
   - the usual business-rule vars (`PLATFORM_COMMISSION_RATE`, etc.)
4. **Domain/port** — Settings → Networking → Generate Domain. Railway injects `PORT` into the
   container and `start.sh` binds Next.js to it, so you don't need to hardcode a port number —
   Railway auto-detects and targets whatever `$PORT` your process is listening on. If it prompts
   you to type a target port anyway, use whatever value the dashboard shows for `$PORT` on that
   service (do **not** enter `80` — nothing in this image listens on 80).
5. Once it's up, run the superuser creation one-off via Railway's shell/CLI (`railway run python
   manage.py createsuperuser` from `backend/`, or the "Run Command" panel on the service).

## Business rules encoded in the backend

- `PLATFORM_COMMISSION_RATE` (default 2%): charged on a booking's total value once staff mark it
  **collected**, recorded in `finance.CommissionLedger`.
- `SELLER_LISTING_FEE` (default $1): created as a due `finance.SellerListingFee` whenever a
  seller publishes a listing; staff mark it paid from the ops portal.
- `BOOKING_DEPOSIT_RATE` (default 30%): used when a buyer chooses the "deposit" payment plan
  instead of paying in full.
