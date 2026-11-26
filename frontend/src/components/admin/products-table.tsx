// ─────────────────────────────────────────────────────────────────────────────
// FILE: components/admin/products-table.tsx
// Admin list of active products, each with an Edit link.
// DATA COMES FROM: the `products` prop (the admin products page fetched them).
// ─────────────────────────────────────────────────────────────────────────────

// Link to another page of our site.
import Link from 'next/link';
// The stock pill.
import { StockBadge } from '@/components/products/stock-badge';
// Shared table styles.
import { linkClass, tableClass, tdClass, thClass } from '@/components/ui/styles';
// 499 -> "₹499.00"
import { formatRupees } from '@/lib/format';
// Builds "/admin/products/<id>/edit".
import { editProductPath } from '@/lib/routes';
// The Product shape.
import type { Product } from '@/types/product';

export function ProductsTable({ products }: { products: Product[] }) {
  return (
    <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white">
      <table className={tableClass}>
        <thead>
          <tr>
            <th className={thClass}>Name</th>
            <th className={thClass}>Price</th>
            <th className={thClass}>Stock</th>
            <th className={thClass}>Action</th>
          </tr>
        </thead>
        <tbody>
          {/* One row per product */}
          {products.map((product) => (
            <tr key={product.id}>
              <td className={tdClass}>{product.name}</td>
              <td className={tdClass}>{formatRupees(product.price)}</td>
              <td className={tdClass}>
                <StockBadge stock={product.stockQuantity} />
              </td>
              <td className={tdClass}>
                <Link href={editProductPath(product.id)} className={linkClass}>
                  Edit
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
