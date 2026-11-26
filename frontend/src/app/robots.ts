// ─────────────────────────────────────────────────────────────────────────────
// FILE: app/robots.ts — creates the page /robots.txt.
// /robots.txt: crawl the public shop, skip the private pages, and here is the sitemap.
// (Search engine robots read this file before visiting the site.)
// ─────────────────────────────────────────────────────────────────────────────

// The type of the robots data.
import type { MetadataRoute } from 'next';
// /dashboard, /orders, /checkout, /admin (the same list proxy.ts protects).
import { PRIVATE_PATHS } from '@/lib/routes';
// The site's full address.
import { SITE_URL } from '@/lib/seo';

export default function robots(): MetadataRoute.Robots {
  return {
    // userAgent '*' = these rules are for every robot.
    rules: { userAgent: '*', allow: '/', disallow: PRIVATE_PATHS },
    // Where the sitemap is.
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
