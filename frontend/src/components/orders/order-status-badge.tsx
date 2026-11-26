// ─────────────────────────────────────────────────────────────────────────────
// FILE: components/orders/order-status-badge.tsx
// A coloured pill for an order status. Its only input (prop): the status.
// ─────────────────────────────────────────────────────────────────────────────

// The list of statuses (type).
import type { OrderStatus } from '@/types/order';

// One colour per status. Record<OrderStatus, string> = TypeScript makes sure
// EVERY status has a colour (forget one and it won't compile).
const colours: Record<OrderStatus, string> = {
  PENDING: 'bg-amber-50 text-amber-800', // yellow: waiting
  CONFIRMED: 'bg-blue-50 text-blue-700', // blue: paid
  SHIPPED: 'bg-indigo-50 text-indigo-700', // purple: on the way
  DELIVERED: 'bg-green-50 text-green-700', // green: done
  CANCELLED: 'bg-slate-100 text-slate-600', // grey: cancelled
  FAILED: 'bg-red-50 text-red-700', // red: payment failed
};

export function OrderStatusBadge({ status }: { status: OrderStatus }) {
  return (
    // colours[status] = look up this status's colour.
    <span className={`inline-block rounded-full px-3 py-1 text-xs font-semibold ${colours[status]}`}>
      {status}
    </span>
  );
}
