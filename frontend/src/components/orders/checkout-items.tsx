// ─────────────────────────────────────────────────────────────────────────────
// FILE: components/orders/checkout-items.tsx
// The checkout table: one quantity box per product, named "qty-<id>".
// The product from "Order now" (?productId=) starts at 1, the rest at 0.
// DATA COMES FROM: the inputs (props) given by the checkout page (product list + selected id).
// The numbers typed here are read by placeOrder() in actions/order.actions.ts.
// ─────────────────────────────────────────────────────────────────────────────

// The stock pill.
import { StockBadge } from '@/components/products/stock-badge';
// Shared styles.
import { inputClass, tableClass, tdClass, thClass } from '@/components/ui/styles';
// "qty-" — the same prefix the action looks for.
import { QTY_PREFIX } from '@/lib/form';
// 499 -> "₹499.00"
import { formatRupees } from '@/lib/format';
// The Product shape.
import type { Product } from '@/types/product';

export function CheckoutItems({ products, selectedId }: { products: Product[]; selectedId?: string }) {
  return (
    <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white">
      <table className={tableClass}>
        <thead>
          <tr>
            <th className={thClass}>Product</th>
            <th className={thClass}>Price</th>
            <th className={thClass}>Stock</th>
            <th className={thClass}>Quantity</th>
          </tr>
        </thead>
        <tbody>
          {/* One row per product; the pre-selected one gets a light blue background */}
          {products.map((product) => (
            <tr key={product.id} className={product.id === selectedId ? 'bg-brand-50' : undefined}>
              <td className={tdClass}>{product.name}</td>
              <td className={tdClass}>{formatRupees(product.price)}</td>
              <td className={tdClass}>
                <StockBadge stock={product.stockQuantity} />
              </td>
              <td className={tdClass}>
                <input
                  type="number" // number box with up/down arrows
                  name={`${QTY_PREFIX}${product.id}`} // e.g. "qty-abc..." -> the action reads it
                  aria-label={`Quantity of ${product.name}`} // read out by screen readers
                  min={0} // can't go below 0
                  max={product.stockQuantity} // can't ask for more than is left
                  step={1} // whole numbers only
                  // start at 1 for the product chosen with "Order now", else 0
                  defaultValue={product.id === selectedId && product.stockQuantity > 0 ? 1 : 0}
                  disabled={product.stockQuantity === 0} // out of stock -> can't type
                  className={`w-24 ${inputClass}`}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
