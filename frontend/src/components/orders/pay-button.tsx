'use client';
// FILE: components/orders/pay-button.tsx — "Pay ₹…" with Razorpay.
import Script from 'next/script';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { beginPayment, confirmPayment, recordPaymentFailure } from '@/actions/payment.actions';
import { Alert } from '@/components/ui/alert';
import { buttonClass } from '@/components/ui/styles';
import type { FormState } from '@/lib/form';
import { formatOrderNumber, formatRupees } from '@/lib/format';
import { SITE_NAME } from '@/lib/seo';

const CHECKOUT_SCRIPT = 'https://checkout.razorpay.com/v1/checkout.js';

interface RazorpaySuccess {
  razorpay_payment_id: string;
  razorpay_order_id: string;
  razorpay_signature: string;
}
interface RazorpayOptions {
  key: string; // public key id
  order_id: string; // the Razorpay order to pay
  amount: number; // in paise
  currency: string;
  name: string; // shown at the top of the popup
  description: string; // shown under the name
  prefill: { name: string; email: string }; // fills in the customer's details
  handler: (response: RazorpaySuccess) => void; // called after a successful payment
  modal: { ondismiss: () => void }; // called when the customer closes the popup
}
// The popup object: open() shows it; on('payment.failed', ...) listens for failures.
interface RazorpayCheckout {
  open: () => void;
  on: (event: 'payment.failed', listener: () => void) => void;
}
// "declare global" = tell TypeScript that checkout.js adds window.Razorpay (a class we can "new").
declare global {
  interface Window {
    Razorpay?: new (options: RazorpayOptions) => RazorpayCheckout;
  }
}

// orderId = which order to pay; amount = its total in rupees (for the button text).
export function PayButton({ orderId, amount }: { orderId: string; amount: number }) {
  // To redraw the page after paying.
  const router = useRouter();
  // ready = checkout.js has loaded; busy = a payment is in progress; error = message to show.
  const [ready, setReady] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string>();

  // The end of every path (success, failure, or error): show the message, unlock, redraw.
  function finish(state: FormState) {
    setError(state?.error);
    setBusy(false);
    router.refresh();
  }

  // Runs when the button is clicked.
  async function pay() {
    // "?." safety: the script may have failed to load (no internet, blocked by an ad blocker).
    if (!window.Razorpay) {
      setError('The payment window could not be loaded. Check your connection and try again.');
      return;
    }
    setBusy(true);
    setError(undefined);

    // Step 1: ask our backend (through the server) for the popup details.
    const started = await beginPayment(orderId);
    if (!started.ok) {
      setError(started.state?.error); 
      setBusy(false);
      return;
    }
    const session = started.data;

    // Step 2: open Razorpay's popup.
    const checkout = new window.Razorpay({
      key: session.keyId,
      order_id: session.razorpayOrderId,
      amount: session.amount,
      currency: session.currency,
      name: SITE_NAME,
      description: `Order ${formatOrderNumber(orderId)}`,
      prefill: { name: session.customerName, email: session.customerEmail },
      // Step 3a: paid -> forward Razorpay's proof to our backend to check it.
      handler: (response) => {
        void confirmPayment(orderId, {
          razorpayPaymentId: response.razorpay_payment_id,
          razorpaySignature: response.razorpay_signature,
        }).then(finish);
      },
      // Closed without paying -> just unlock the button (the order stays as it was).
      modal: { ondismiss: () => setBusy(false) },
    });
    // Step 3b: failed (card declined...) -> record it. The popup stays open so they can retry.
    checkout.on('payment.failed', () => {
      void recordPaymentFailure(orderId).then(finish);
    });
    checkout.open();
  }

  return (
    <div className="flex flex-col gap-2">
      {/* Load Razorpay's script; onReady = it's loaded -> enable the button */}
      <Script src={CHECKOUT_SCRIPT} strategy="lazyOnload" onReady={() => setReady(true)} />
      {error && <Alert>{error}</Alert>}
      <button type="button" onClick={pay} disabled={!ready || busy} className={buttonClass.primary}>
        {/* Three texts: still loading, paying, or the normal label */}
        {!ready ? 'Loading payment…' : busy ? 'Processing payment…' : `Pay ${formatRupees(amount)}`}
      </button>
    </div>
  );
}
