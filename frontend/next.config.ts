// ─────────────────────────────────────────────────────────────────────────────
// FILE: next.config.ts — settings for Next.js itself (read when `npm run dev/build` starts).
// ─────────────────────────────────────────────────────────────────────────────

// The type of the settings object (so TypeScript checks our setting names).
import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // Cache Components: pages are pre-built as a ready-made outline (a "shell"); anything reading
  // cookies / URL values / fresh data must be inside <Suspense> and arrives a moment later.
  cacheComponents: true,
  // Pre-load only the static part of linked pages (faster navigation).
  partialPrefetching: true,
  // Turbopack = the fast tool that packs all our files into what the browser downloads.
  turbopack: {
    root: __dirname, // the project folder is this folder (frontend/)
    rules: {
      // Every .css file goes through the Tailwind loader (no postcss config needed).
      '*.css': {
        loaders: ['@tailwindcss/turbopack'],
        as: '*.css',
      },
    },
  },
};

// Hand the settings to Next.js.
export default nextConfig;
