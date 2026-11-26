// ─────────────────────────────────────────────────────────────────────────────
// FILE: app/sitemap.ts — creates the page /sitemap.xml.
// /sitemap.xml: the home page + every product page, so search engines find them all.
//
// CONCEPT — special files: Next.js turns app/sitemap.ts into /sitemap.xml and
//   app/robots.ts into /robots.txt automatically. We only return the data.
// ─────────────────────────────────────────────────────────────────────────────

// The type of a sitemap list.
import type { MetadataRoute } from 'next';
// Builds "/products/<id>".
import { productPath } from '@/lib/routes';
// The site's full address.
import { SITE_URL } from '@/lib/seo';
// GET /products.
import { getProducts } from '@/services/product.service';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const products = await getProducts().catch(() => []); // backend down -> just the home page
  return [
    // The home page: changes daily, most important (priority 1).
    { url: SITE_URL, changeFrequency: 'daily', priority: 1 },
    // "...products.map(...)" = add one entry per product into this same list.
    ...products.map((product) => ({
      url: new URL(productPath(product.id), SITE_URL).toString(), // full URL
      lastModified: product.updatedAt, // when it last changed
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    })),
  ];
}
