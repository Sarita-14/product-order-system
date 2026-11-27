// ─────────────────────────────────────────────────────────────────────────────
// FILE: verify-payment.usecase.ts — Razorpay says "paid"; we check it's true.
//   valid signature   -> order becomes CONFIRMED (+ the payment id is saved)
//   invalid signature -> order becomes FAILED, answer 400
//   already CONFIRMED by the webhook for this same payment -> just answer with it
//     (the webhook can arrive a moment before the browser's call; that's still a success)
// ─────────────────────────────────────────────────────────────────────────────

// BadRequestException = a 400 error.
import { BadRequestException, Injectable } from '@nestjs/common';
// The Order entity (return type).
import { Order } from '../../orders/entities/order.entity';
// Statuses + which ones can be paid.
import { OrderStatus, PAYABLE_STATUSES } from '../../orders/enums/order-status.enum';
// Database access for orders.
import { OrdersRepository } from '../../orders/repositories/orders.repository';
// Reused: load an order again (for the answer).
import { GetOrderUseCase } from '../../orders/usecases/get-order.usecase';
// The body: payment id + signature.
import { VerifyPaymentDto } from '../dto/verify-payment.dto';
// Checks the signature.
import { RazorpayGateway } from '../gateways/razorpay.gateway';
// Reused: my order, still unpaid.
import { GetPayableOrderUseCase } from './get-payable-order.usecase';

@Injectable()
export class VerifyPaymentUseCase {
  // Nest hands us the helpers ready to use.
  constructor(
    private readonly getPayableOrderUseCase: GetPayableOrderUseCase,
    private readonly getOrderUseCase: GetOrderUseCase,
    private readonly ordersRepository: OrdersRepository,
    private readonly razorpay: RazorpayGateway,
  ) {}

  // id = which order; userId = who is asking; dto = what Razorpay gave the browser.
  async execute(id: string, userId: string, dto: VerifyPaymentDto): Promise<Order> {
    // The webhook was faster and already confirmed THIS payment -> success, nothing to do.
    const current = await this.getOrderUseCase.execute(id, userId); // 404 if not theirs
    if (current.status === OrderStatus.CONFIRMED && current.razorpayPaymentId === dto.razorpayPaymentId) {
      return current;
    }

    // 404 if not theirs, 400 if already paid/cancelled.
    const order = await this.getPayableOrderUseCase.execute(id, userId);

    // Valid only if Pay was started (we saved a Razorpay order id) AND the signature matches it.
    const valid =
      !!order.razorpayOrderId &&
      this.razorpay.isSignatureValid(order.razorpayOrderId, dto.razorpayPaymentId, dto.razorpaySignature);

    if (!valid) {
      // Fake or broken proof -> mark FAILED (the customer may try again) and answer 400.
      await this.ordersRepository.changeStatus(id, PAYABLE_STATUSES, OrderStatus.FAILED);
      throw new BadRequestException('Payment verification failed');
    }

    // Real payment -> CONFIRMED. "false" means someone changed the order a moment ago (e.g. cancelled).
    const confirmed = await this.ordersRepository.confirmPayment(id, PAYABLE_STATUSES, dto.razorpayPaymentId);
    if (!confirmed) {
      throw new BadRequestException('The order changed while paying; it was not confirmed');
    }
    // Load it again so the answer shows CONFIRMED.
    return this.getOrderUseCase.execute(id);
  }
}
