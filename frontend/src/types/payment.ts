
// FILE: types/payment.ts — the shapes used while paying with Razorpay.
// DATA COMES FROM: POST /orders/:id/payment (backend) and Razorpay's popup.

export interface PaymentSession {
  orderId: string; // our order id
  keyId: string; // Razorpay PUBLIC key (the secret never leaves the backend)
  razorpayOrderId: string; // Razorpay's id for this payment attempt
  amount: number; // in PAISE (₹499.00 = 49900)
  currency: string; // "INR"
  customerName: string; // pre-filled in the popup
  customerEmail: string; // pre-filled in the popup
}

// What we forward to POST /orders/:id/payment/verify after a successful payment.
export interface PaymentProof {
  razorpayPaymentId: string; // "pay_Xyz789"
  razorpaySignature: string; // Razorpay's proof; the backend checks it with the secret key
}
