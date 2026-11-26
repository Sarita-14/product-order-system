// ─────────────────────────────────────────────────────────────────────────────
// FILE: components/products/product-details.tsx
// The body of /products/[id]: description, price, stock and "Order now".
// "Order now" goes to /checkout; proxy.ts sends visitors to /login first.
// DATA COMES FROM: the `product` prop (the page fetched it).
// ─────────────────────────────────────────────────────────────────────────────

// Link to another page of our site.
import Link from 'next/link';
// Shared styles.
import { buttonClass, cardClass } from '@/components/ui/styles';
// 499 -> "₹499.00"
import { formatRupees } from '@/lib/format';
// Builds "/checkout?productId=<id>".
import { checkoutPath } from '@/lib/routes';
// The Product shape.
import type { Product } from '@/types/product';
// The stock pill.
import { StockBadge } from './stock-badge';

export function ProductDetails({ product }: { product: Product }) {
  // Can it be ordered?
  const inStock = product.stockQuantity > 0;
  return (
    <article className={`flex flex-col gap-4 ${cardClass}`}>
      <p className="text-slate-700">{product.description || 'No description available.'}</p>
      <p className="text-2xl font-bold text-brand-600">{formatRupees(product.price)}</p>
      <StockBadge stock={product.stockQuantity} />
      {/* In stock -> a link styled as a button; out of stock -> a disabled button */}
      {inStock ? (
        <Link href={checkoutPath(product.id)} className={`w-fit ${buttonClass.primary}`}>
          Order now
        </Link>
      ) : (
        <button type="button" disabled className={`w-fit ${buttonClass.primary}`}>
          Out of stock
        </button>
      )}
    </article>
  );
}
