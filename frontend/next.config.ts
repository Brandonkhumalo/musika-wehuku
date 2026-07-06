import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  // The /api/[...path] proxy always appends its own trailing slash before
  // calling Django, so incoming requests shouldn't be redirected based on
  // whether they had one — that redirect would silently drop POST/PATCH
  // bodies on the resend for some clients.
  skipTrailingSlashRedirect: true,
  images: {
    remotePatterns: [
      { protocol: "http", hostname: "localhost" },
      { protocol: "http", hostname: "backend" },
    ],
  },
  // /media/* is proxied at runtime by src/app/media/[...path]/route.ts instead of
  // a next.config rewrite: rewrites() destinations are resolved at build time, but
  // BACKEND_INTERNAL_URL is only known at container-run time in Docker, so a
  // config-level rewrite would silently bake in the wrong host.
};

export default nextConfig;
