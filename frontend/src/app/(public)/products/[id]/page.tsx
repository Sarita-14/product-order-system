// ─────────────────────────────────────────────────────────────────────────────
// FILE: app/(public)/products/[id]/page.tsx — one product's page, "/products/<id>".
//
// CONCEPT — dynamic route "[id]": a folder in square brackets matches ANY value.
//   /products/abc-123 -> this page with params.id = "abc-123".
//
// CONCEPT — generateMetadata: like `metadata`, but a function, because the
//   title depends on data (the product's name).
// ─────────────────────────────────────────────────────────────────────────────

// Type of the metadata object (the title/description info for Google).
import type { Metadata } from 'next';
// Link to another page of our site.
import Link from 'next/link';
// cache = remember an answer for this request; Suspense = wait for data.
import { cache, Suspense } from 'react';
// The product's body (price, stock, Order now).
import { ProductDetails } from '@/components/products/product-details';
// Writes structured data for Google.
import { JsonLd } from '@/components/seo/json-ld';
// "Loading…" text.
import { Loading } from '@/components/ui/loading';
// The page's <h1>.
import { PageHeading } from '@/components/ui/page-heading';
// Link style.
import { linkClass } from '@/components/ui/styles';
// API "not found" -> 404 page.
import { findOrNotFound } from '@/lib/not-found';
// Builds "/products/<id>".
import { productPath } from '@/lib/routes';
// SEO helpers.
import { breadcrumbJsonLd, buildMetadata, productJsonLd } from '@/lib/seo';
// GET /products/<id>.
import { getProductById } from '@/services/product.service';

// The [id] from the URL. Next gives it as a Promise = a value that arrives a moment later, so we wait for it with await.
type Params = Promise<{ id: string }>;

// cache(): generateMetadata and the page both need the product -> one API call per request.
// Missing product (or bad id) -> the 404 page.
const loadProduct = cache((id: string) => findOrNotFound(getProductById(id)));

// SEO built from the product itself (name as title, its description).
export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { id } = await params; // wait for the URL value
  const product = await loadProduct(id); // fetch (or reuse) the product
  return buildMetadata({
    title: product.name,
    description: product.description || `Buy ${product.name} online.`,
    path: productPath(id),
  });
}

// The page: URL data is request data -> inside <Suspense>.
export default function ProductPage({ params }: { params: Params }) {
  return (
    <Suspense fallback={<Loading />}>
      <Product params={params} />
    </Suspense>
  );
}

// Container: reads the id, loads the product, shows it.
async function Product({ params }: { params: Params }) {
  const { id } = await params;
  const product = await loadProduct(id); // same request -> no second API call
  const path = productPath(id);

  return (
    <section className="flex flex-col gap-6">
      {/* Breadcrumb = "where am I": Products / <name> */}
      <nav aria-label="Breadcrumb" className="text-sm text-slate-500">
        <Link href="/" className={linkClass}>
          Products
        </Link>{' '}
        / {product.name}
      </nav>
      <PageHeading title={product.name} />
      <ProductDetails product={product} />
      {/* Structured data: product + price + stock, and the breadcrumb */}
      <JsonLd data={productJsonLd(product, path)} />
      <JsonLd
        data={breadcrumbJsonLd([
          { name: 'Products', path: '/' },
          { name: product.name, path },
        ])}
      />
    </section>
  );
}
