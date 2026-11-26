// ─────────────────────────────────────────────────────────────────────────────
// FILE: app/(public)/page.tsx — the HOME page "/" (product grid).
//
// CONCEPT — route group "(public)": a folder name in brackets is NOT part of
//   the URL. It only groups files. So this file is "/", not "/public".
//
// CONCEPT — <Suspense>: wraps a part that must WAIT for data. Next first sends
//   the page with the stand-in `fallback` ("Loading…"), then sends the real part a moment later
//   when the data arrives. With cacheComponents on, anything reading the
//   cookie or fetching fresh data MUST be inside <Suspense>.
// ─────────────────────────────────────────────────────────────────────────────

// Suspense: see above.
import { Suspense } from 'react';
// The product box.
import { ProductCard } from '@/components/products/product-card';
// Red error box.
import { Alert } from '@/components/ui/alert';
// "Loading…" text.
import { Loading } from '@/components/ui/loading';
// The page's <h1>.
import { PageHeading } from '@/components/ui/page-heading';
// Grey text style.
import { mutedClass } from '@/components/ui/styles';
// SEO helper.
import { buildMetadata } from '@/lib/seo';
// GET /products.
import { getProducts } from '@/services/product.service';

// SEO for this page: Next turns it into <title>, <meta description>, canonical (the page's official address), etc.
export const metadata = buildMetadata({
  title: 'Products',
  description: 'Browse our products and order online. Sign in to place an order.',
  path: '/',
});

// The page itself: a heading, then the product grid.
// "export default" = this is the page Next shows for this URL.
export default function HomePage() {
  return (
    <section className="flex flex-col gap-8">
      <PageHeading title="Our products" subtitle="Browse freely. Sign in when you are ready to place an order." />

      {/* The list needs data from the backend, so it loads inside <Suspense>. */}
      <Suspense fallback={<Loading />}>
        <ProductList />
      </Suspense>
    </section>
  );
}

// Container: fetches the products ON THE SERVER, then shows one card per product.
async function ProductList() {
  // Ask the backend. If it fails, log the reason and use null instead of crashing.
  const products = await getProducts().catch((error: unknown) => {
    console.error('Failed to load products:', error); // the real reason, in the server terminal
    return null;
  });

  // Backend failed -> friendly red message.
  if (!products) return <Alert>Could not load products right now. Please try again in a moment.</Alert>;
  // No products yet -> grey message.
  if (products.length === 0) return <p className={mutedClass}>No products available yet.</p>;

  return (
    // A grid: as many columns as fit, each at least 280px wide.
    <div className="grid grid-cols-[repeat(auto-fit,minmax(280px,1fr))] gap-6">
      {/* One card per product; key = unique id React needs for lists */}
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
