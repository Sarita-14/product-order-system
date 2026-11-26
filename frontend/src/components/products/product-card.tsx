// ─────────────────────────────────────────────────────────────────────────────
// FILE: components/products/product-card.tsx
// One product box on the home page. It only DISPLAYS what it is given; it never fetches data.
// The name links to the product page.
// DATA COMES FROM: the `product` prop (the home page fetched the list).
// ─────────────────────────────────────────────────────────────────────────────

// Link to another page of our site.
import Link from 'next/link';
// 499 -> "₹499.00"
import { formatRupees } from '@/lib/format';
// Builds "/products/<id>".
import { productPath } from '@/lib/routes';
// The Product shape.
import type { Product } from '@/types/product';
// The stock pill.
import { StockBadge } from './stock-badge';

export function ProductCard({ product }: { product: Product }) {
  return (
    // <article> = a self-contained piece of content (a tag that tells Google what the content is: good for SEO).
    <article className="flex flex-col gap-3 rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition hover:shadow-md">
      <div className="flex items-start justify-between gap-3">
        {/* h2, because the page's h1 is "Our products" */}
        <h2 className="text-lg font-semibold text-slate-900">
          <Link href={productPath(product.id)} className="hover:text-brand-700">
            {product.name}
          </Link>
        </h2>
        <p className="shrink-0 text-lg font-bold text-brand-600">{formatRupees(product.price)}</p>
      </div>

      {/* flex-1 = take the free space, so all cards line up at the bottom */}
      <p className="flex-1 text-sm text-slate-600">
        {/* "||" = if the description is empty, show this text instead */}
        {product.description || 'No description available.'}
      </p>

      <StockBadge stock={product.stockQuantity} />
    </article>
  );
}
