// FILE: components/orders/cancel-order-button.tsx — the "Cancel order" button.
// Used in the "My orders" list (one per row) and on the order page.
// What cancelling does (backend, in ONE database transaction):
// Only PENDING or FAILED (= unpaid) orders can be cancelled; otherwise nothing is shown.

// The Server Action that cancels.
import { cancelOrder } from '@/actions/order.actions';
// The shared form (button + red error).
import { ActionForm } from '@/components/ui/action-form';
// Which statuses can still be cancelled + the Order shape.
import { CANCELLABLE_STATUSES, type Order } from '@/types/order';

export function CancelOrderButton({ order }: { order: Pick<Order, 'id' | 'status'> }) {
  // Paid / shipped / already cancelled -> no button.
  if (!CANCELLABLE_STATUSES.includes(order.status)) return null;
  return (
    // .bind(null, order.id) = the action already knows WHICH order to cancel
    <ActionForm
      action={cancelOrder.bind(null, order.id)}
      submitLabel="Cancel order"
      pendingLabel="Cancelling…"
      variant="danger"
      className="flex flex-col gap-2"
    />
  );
}
