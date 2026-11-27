// ─────────────────────────────────────────────────────────────────────────────
// FILE: payments.module.ts — puts all the payment (Razorpay) pieces together.
// (What a module is: see auth/auth.module.ts.)
// ─────────────────────────────────────────────────────────────────────────────

// Module = the decorator that makes a module.
import { Module } from '@nestjs/common';
// OrdersModule exports OrdersRepository + GetOrderUseCase, which we reuse.
import { OrdersModule } from '../orders/orders.module';
// Our own classes.
import { PaymentsController } from './controllers/payments.controller';
import { RazorpayWebhookController } from './controllers/razorpay-webhook.controller';
import { RazorpayGateway } from './gateways/razorpay.gateway';
import { PaymentsService } from './services/payments.service';
import { FailPaymentUseCase } from './usecases/fail-payment.usecase';
import { GetPayableOrderUseCase } from './usecases/get-payable-order.usecase';
import { HandleRazorpayWebhookUseCase } from './usecases/handle-razorpay-webhook.usecase';
import { StartPaymentUseCase } from './usecases/start-payment.usecase';
import { VerifyPaymentUseCase } from './usecases/verify-payment.usecase';

@Module({
  imports: [OrdersModule], // -> OrdersRepository, GetOrderUseCase
  // Receive the HTTP requests: the app's Pay routes + Razorpay's own webhook.
  controllers: [PaymentsController, RazorpayWebhookController],
  // Everything Nest must create for us and hand out.
  providers: [
    PaymentsService,
    RazorpayGateway,
    GetPayableOrderUseCase,
    StartPaymentUseCase,
    VerifyPaymentUseCase,
    FailPaymentUseCase,
    HandleRazorpayWebhookUseCase,
  ],
})
// Empty class; the settings above do the work.
export class PaymentsModule {}
