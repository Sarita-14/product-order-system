// ─────────────────────────────────────────────────────────────────────────────
// FILE: components/orders/pay-button.tsx
// Placeholder: online payment is added in the next task, so it is disabled for now.
// ─────────────────────────────────────────────────────────────────────────────

// Button looks.
import { buttonClass } from '@/components/ui/styles';
// 499 -> "₹499.00"
import { formatRupees } from '@/lib/format';

// amount = the order total to show on the button.
export function PayButton({ amount }: { amount: number }) {
  return (
    // disabled = can't be clicked; title = the tooltip shown on mouse-over.
    <button type="button" disabled title="Online payment is coming soon" className={buttonClass.primary}>
      Pay {formatRupees(amount)} (coming soon)
    </button>
  );
}
