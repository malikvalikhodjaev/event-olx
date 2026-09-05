import type { NextConfig } from "next";

const sitesStaticExport = process.env.MAROSIM_SITES_STATIC_EXPORT === "1";

const nextConfig: NextConfig = {
  output: sitesStaticExport ? "export" : "standalone",
  poweredByHeader: false,
  reactStrictMode: true,
  allowedDevOrigins: ["127.0.0.1"],
  images: sitesStaticExport ? { unoptimized: true } : undefined,
  ...(sitesStaticExport ? {} : {
    async headers() {
      return [
        {
          source: "/:path*",
          headers: [
            { key: "X-Content-Type-Options", value: "nosniff" },
            { key: "X-Frame-Options", value: "DENY" },
            { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
            { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
          ],
        },
        {
          source: "/sw.js",
          headers: [
            { key: "Content-Type", value: "application/javascript; charset=utf-8" },
            { key: "Cache-Control", value: "no-cache, no-store, must-revalidate" },
            { key: "Content-Security-Policy", value: "default-src 'self'; script-src 'self'" },
          ],
        },
      ];
    },
  }),
};

export default nextConfig;
