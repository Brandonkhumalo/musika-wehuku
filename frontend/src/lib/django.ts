/** Base URL of the Django backend, reachable only from the Next.js server. */
export const DJANGO_URL = process.env.BACKEND_INTERNAL_URL ?? "http://localhost:8000";
