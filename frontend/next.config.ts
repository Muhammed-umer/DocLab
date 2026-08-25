import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  turbopack: {
    root: __dirname,
  },
  async rewrites() {
    return [
      {
        source: "/api/py/:path*",
        destination:
          process.env.NODE_ENV === "development"
            ? "http://127.0.0.1:8000/:path*"
            : "/api/index.py",
      },
      {
        source: "/documents/:path*",
        destination:
          process.env.NODE_ENV === "development"
            ? "http://127.0.0.1:8000/documents/:path*"
            : "/api/index.py",
      },
      {
        source: "/settings",
        destination:
          process.env.NODE_ENV === "development"
            ? "http://127.0.0.1:8000/settings"
            : "/api/index.py",
      },
      {
        source: "/health",
        destination:
          process.env.NODE_ENV === "development"
            ? "http://127.0.0.1:8000/health"
            : "/api/index.py",
      },
    ];
  },
};

export default nextConfig;
