// ─────────────────────────────────────────────────────────────────────────────
// FILE: verify-payment.dto.ts — body of POST /orders/:id/payment/verify.
// The browser receives these two values from Razorpay after a successful payment
// and forwards them. We do NOT accept the Razorpay order id from the browser:
// we use the one we saved ourselves, so a payment for another order can't be reused.
// (Plain // comments, not /** */: the Swagger plugin turns JSDoc into API docs.)
// ─────────────────────────────────────────────────────────────────────────────

// IsNotEmpty / IsString = checks; a wrong body gets a 400 before our code runs.
import { IsNotEmpty, IsString } from 'class-validator';

export class VerifyPaymentDto {
  // Razorpay's payment id.
  // @example "pay_Xyz789"
  @IsString()
  @IsNotEmpty()
  razorpayPaymentId: string;

  // The proof from Razorpay; checked with our secret key.
  // @example "9ef4dffbfd84f1318f6739a3ce19f9d85851857ae648f114332d8401e0949a3d"
  @IsString()
  @IsNotEmpty()
  razorpaySignature: string;
}
