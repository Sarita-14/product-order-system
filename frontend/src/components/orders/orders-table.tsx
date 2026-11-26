// ─────────────────────────────────────────────────────────────────────────────
// FILE: components/orders/orders-table.tsx
// The list of orders: used by the customer dashboard AND the admin orders page
// (one component, two uses — the admin version turns on the extra columns).
// DATA COMES FROM: the `orders` prop (the page fetched them).
// ─────────────────────────────────────────────────────────────────────────────

// Link to another page of our site.
import Link from 'next/link';
// ReactNode = anything that can be shown.
import type { ReactNode } from 'react';
// Shared table styles.
import { linkClass, tableClass, tdClass, thClass } from '@/components/ui/styles';
// Display helpers.
import { formatDate, formatOrderNumber, formatRupees } from '@/lib/format';
// Builds "/orders/<id>".
import { orderPath } from '@/lib/routes';
// The Order shape.
import type { Order } from '@/types/order';
// The coloured status pill.
import { OrderStatusBadge } from './order-status-badge';

// The inputs (props) this table accepts.
interface OrdersTableProps {
  orders: Order[];
  showCustomer?: boolean; // admin: who placed it
  renderAction?: (order: Order) => ReactNode; // admin: the status form for each row
}

export function OrdersTable({ orders, showCustomer = false, renderAction }: OrdersTableProps) {
  return (
    // overflow-x-auto = on narrow screens the table scrolls sideways instead of breaking.
    <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white">
      <table className={tableClass}>
        {/* The header row */}
        <thead>
          <tr>
            <th className={thClass}>Order</th>
            <th className={thClass}>Date</th>
            {showCustomer && <th className={thClass}>Customer</th>}
            <th className={thClass}>Items</th>
            <th className={thClass}>Total</th>
            <th className={thClass}>Status</th>
            {renderAction && <th className={thClass}>Action</th>}
          </tr>
        </thead>
        <tbody>
          {/* .map = one <tr> row per order. key = a unique id React needs for lists. */}
          {orders.map((order) => (
            <tr key={order.id}>
              <td className={tdClass}>
                <Link href={orderPath(order.id)} className={linkClass}>
                  {formatOrderNumber(order.id)}
                </Link>
              </td>
              <td className={tdClass}>{formatDate(order.createdAt)}</td>
              {showCustomer && (
                <td className={tdClass}>
                  {order.customerName}
                  <span className="block text-xs text-slate-500">{order.customerEmail}</span>
                </td>
              )}
              {/* Total number of pieces: add up every line's quantity, starting from 0 */}
              <td className={tdClass}>{order.items.reduce((sum, item) => sum + item.quantity, 0)}</td>
              <td className={tdClass}>{formatRupees(order.totalAmount)}</td>
              <td className={tdClass}>
                <OrderStatusBadge status={order.status} />
              </td>
              {/* The page decides what goes here (admin: the status form) */}
              {renderAction && <td className={tdClass}>{renderAction(order)}</td>}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
