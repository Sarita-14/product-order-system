// ─────────────────────────────────────────────────────────────────────────────
// FILE: components/orders/order-details.tsx
// One order: status, date, and a table of items with line totals and the grand total.
// DATA COMES FROM: the `order` prop (the order page fetched it).
// ─────────────────────────────────────────────────────────────────────────────

// Shared styles.
import { cardClass, tableClass, tdClass, thClass } from '@/components/ui/styles';
// Display helpers.
import { formatDate, formatRupees } from '@/lib/format';
// The Order shape.
import type { Order } from '@/types/order';
// The coloured status pill.
import { OrderStatusBadge } from './order-status-badge';

export function OrderDetails({ order }: { order: Order }) {
  return (
    <section className={`flex flex-col gap-4 ${cardClass}`}>
      {/* Status pill + date, side by side */}
      <div className="flex flex-wrap items-center gap-3 text-sm text-slate-600">
        <OrderStatusBadge status={order.status} />
        <span>Placed {formatDate(order.createdAt)}</span>
      </div>

      <div className="overflow-x-auto">
        <table className={tableClass}>
          <thead>
            <tr>
              <th className={thClass}>Product</th>
              {/* text-right = numbers line up on the right */}
              <th className={`${thClass} text-right`}>Quantity</th>
              <th className={`${thClass} text-right`}>Unit price</th>
              <th className={`${thClass} text-right`}>Line total</th>
            </tr>
          </thead>
          <tbody>
            {/* One row per item */}
            {order.items.map((item) => (
              <tr key={item.id}>
                <td className={tdClass}>{item.product.name}</td>
                <td className={`${tdClass} text-right`}>{item.quantity}</td>
                <td className={`${tdClass} text-right`}>{formatRupees(item.unitPrice)}</td>
                <td className={`${tdClass} text-right`}>{formatRupees(item.subtotal)}</td>
              </tr>
            ))}
          </tbody>
          {/* <tfoot> = the bottom row of the table: the grand total */}
          <tfoot>
            <tr>
              {/* colSpan={3} = this cell is 3 columns wide */}
              <th scope="row" colSpan={3} className={`${tdClass} text-right font-semibold`}>
                Total
              </th>
              <td className={`${tdClass} text-right text-lg font-bold text-slate-900`}>
                {formatRupees(order.totalAmount)}
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
    </section>
  );
}
