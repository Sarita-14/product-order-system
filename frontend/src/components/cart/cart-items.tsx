// ─────────────────────────────────────────────────────────────────────────────
// FILE: components/cart/cart-items.tsx — the table of chosen products: one row per
// product, its quantity, line totals and the grand total. Used in two places:
//   cart page  (editable)  -> a quantity box named "qty-<id>" (0 = remove), read by updateCart()
//   checkout   (read-only) -> the quantity as plain text
// DATA COMES FROM: the `lines` prop (the page loaded the cart from the backend).
// ─────────────────────────────────────────────────────────────────────────────

// Link to another page of our site.
import Link from 'next/link';
// Shared styles.
import { inputClass, linkClass, tableClass, tdClass, thClass } from '@/components/ui/styles';
// The line shape + the total helper.
import { cartTotal, type CartItem } from '@/types/cart';
// "qty-" — the same prefix the action looks for.
import { QTY_PREFIX } from '@/lib/form';
// 499 -> "₹499.00"
import { formatRupees } from '@/lib/format';
// Builds "/products/<id>".
import { productPath } from '@/lib/routes';

// editable = show number boxes (cart page) or plain numbers (checkout). Default: editable.
export function CartItems({ lines, editable = true }: { lines: CartItem[]; editable?: boolean }) {
  return (
    <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white">
      <table className={tableClass}>
        <thead>
          <tr>
            <th className={thClass}>Product</th>
            <th className={`${thClass} text-right`}>Price</th>
            <th className={thClass}>Quantity</th>
            <th className={`${thClass} text-right`}>Line total</th>
          </tr>
        </thead>
        <tbody>
          {lines.map(({ product, quantity }) => (
            <tr key={product.id}>
              <td className={tdClass}>
                <Link href={productPath(product.id)} className={linkClass}>
                  {product.name}
                </Link>
              </td>
              <td className={`${tdClass} text-right`}>{formatRupees(product.price)}</td>
              <td className={tdClass}>
                {editable ? (
                  <input
                    type="number"
                    name={`${QTY_PREFIX}${product.id}`} // e.g. "qty-abc..." -> the action reads it
                    aria-label={`Quantity of ${product.name}`}
                    min={0} // 0 = remove from the cart
                    // Up to what I already reserved + what is still left for everyone
                    max={quantity + product.stockQuantity}
                    step={1}
                    defaultValue={quantity}
                    className={`w-24 ${inputClass}`}
                  />
                ) : (
                  quantity
                )}
              </td>
              <td className={`${tdClass} text-right`}>{formatRupees(product.price * quantity)}</td>
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr>
            <th scope="row" colSpan={3} className={`${tdClass} text-right font-semibold`}>
              Total
            </th>
            <td className={`${tdClass} text-right text-lg font-bold text-slate-900`}>
              {formatRupees(cartTotal(lines))}
            </td>
          </tr>
        </tfoot>
      </table>
    </div>
  );
}
