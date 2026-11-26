import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  cacheComponents: true,
  partialPrefetching: true,
  redirects: () => [
    { source: "/", destination: "/products/pagination", permanent: false },
  ],
  turbopack: {
    // the NestJS app above also has a lockfile; this folder is the Next.js root
    root: __dirname,
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
