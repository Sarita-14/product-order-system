// ─────────────────────────────────────────────────────────────────────────────
// FILE: lib/seo.ts — everything search engines (Google) and social sites read.
// SEO helpers: every page builds its metadata through buildMetadata(),
// so title/description/canonical (the page's official address)/robots/Open Graph/Twitter are always complete.
//
// CONCEPT — "metadata": the invisible <head> part of a page: <title>,
//   <meta name="description">, links for sharing... Next.js builds these tags
//   from the `metadata` object a page exports.
// ─────────────────────────────────────────────────────────────────────────────

// The type of Next's metadata object.
import type { Metadata } from 'next';
// The Product shape (for the JSON-LD helper).
import type { Product } from '@/types/product';

// The site's name (shown in titles and when shared).
export const SITE_NAME = 'Product Order System';
// The site's full address, from NEXT_PUBLIC_SITE_URL in .env.local (if it is missing, use this address on your own computer).
export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3001';

// What a page gives buildMetadata.
interface SeoInput {
  title: string; // the tab title
  description: string; // the grey text under the title in Google results
  path: string; // e.g. "/products/123" (made absolute through metadataBase in the root layout)
  noIndex?: boolean; // private pages: login, dashboard, checkout, orders, admin
}

// Builds a complete metadata object from 3-4 inputs (no repeating on every page).
export function buildMetadata({ title, description, path, noIndex = false }: SeoInput): Metadata {
  return {
    title, // <title>
    description, // <meta name="description">
    alternates: { canonical: path }, // "the official URL of this page" (avoids duplicates in Google)
    robots: { index: !noIndex, follow: !noIndex }, // may Google list this page / follow its links?
    // Open Graph = the preview card when the link is shared (WhatsApp, Facebook, LinkedIn...)
    openGraph: { title, description, url: path, siteName: SITE_NAME, type: 'website', locale: 'en_IN' },
    // Twitter/X card = the same idea for Twitter/X
    twitter: { card: 'summary', title, description },
  };
}

// "/products/1" -> "http://localhost:3001/products/1" (structured data needs full URLs).
const absolute = (path: string) => new URL(path, SITE_URL).toString();

// JSON-LD (structured data Google reads) for a product page
// It lets Google show price + "In stock" right in the search results.
export const productJsonLd = (product: Product, path: string) => ({
  '@context': 'https://schema.org', // the shared word list Google understands (schema.org)
  '@type': 'Product', // "this page is about a product"
  name: product.name,
  description: product.description ?? product.name, // no description -> use the name
  url: absolute(path),
  offers: {
    '@type': 'Offer', // "it is for sale"
    price: product.price.toFixed(2), // e.g. "499.00"
    priceCurrency: 'INR', // Indian rupees
    availability:
      product.stockQuantity > 0 ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
    url: absolute(path),
  },
});

// JSON-LD breadcrumb: Home > Product name
// crumbs = the trail of pages; each gets a position number (1, 2, ...).
export const breadcrumbJsonLd = (crumbs: { name: string; path: string }[]) => ({
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  // .map((crumb, index) => ...) = turn each crumb into a ListItem; index starts at 0.
  itemListElement: crumbs.map((crumb, index) => ({
    '@type': 'ListItem',
    position: index + 1, // positions start at 1
    name: crumb.name,
    item: absolute(crumb.path),
  })),
});
