// ─────────────────────────────────────────────────────────────────────────────
// FILE: components/products/product-details.tsx
// The body of /products/[id]: description, price, stock, the buy area.
// "Order now" goes to /checkout; proxy.ts sends visitors to /login first.
// DATA COMES FROM: the `product` prop (the page fetched it).
// ─────────────────────────────────────────────────────────────────────────────

// The buy area: depends on who is looking (visitor / customer / admin).
import { PurchaseActions } from '@/components/cart/purchase-actions';
// Shared styles.
import { cardClass } from '@/components/ui/styles';
// 499 -> "₹499.00"
import { formatRupees } from '@/lib/format';
// The Product shape.
import type { Product } from '@/types/product';
// The stock pill.
import { StockBadge } from './stock-badge';

export function ProductDetails({ product }: { product: Product }) {
  return (
    <article className={`flex flex-col gap-4 ${cardClass}`}>
      <p className="text-slate-700">{product.description || 'No description available.'}</p>
      <p className="text-2xl font-bold text-brand-600">{formatRupees(product.price)}</p>
      <StockBadge stock={product.stockQuantity} />
      {/* Order now + Add to cart (customers), Login/Register (visitors) or Edit product (admins) */}
      <PurchaseActions product={product} showOrderNow />
    </article>
  );
}
