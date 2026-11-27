// ─────────────────────────────────────────────────────────────────────────────
// FILE: start-payment.usecase.ts — the customer clicked "Pay".
// Creates a Razorpay order for the order's total, remembers its id, and returns
// everything the browser needs to open the Razorpay popup.
// ─────────────────────────────────────────────────────────────────────────────

// @Injectable = Nest may create this class for us and hand it to any class that asks for it.
import { Injectable } from '@nestjs/common';
// Database access for orders (to save the Razorpay order id).
import { OrdersRepository } from '../../orders/repositories/orders.repository';
// The answer's shape.
import { PaymentSessionDto } from '../dto/payment-session.dto';
// Talks to Razorpay.
import { RazorpayGateway } from '../gateways/razorpay.gateway';
// Reused: my order, still unpaid.
import { GetPayableOrderUseCase } from './get-payable-order.usecase';

@Injectable()
export class StartPaymentUseCase {
  // Nest hands us the helpers ready to use.
  constructor(
    private readonly getPayableOrderUseCase: GetPayableOrderUseCase,
    private readonly ordersRepository: OrdersRepository,
    private readonly razorpay: RazorpayGateway,
  ) {}

  // id = which order; userId = who is paying (from the token).
  async execute(id: string, userId: string): Promise<PaymentSessionDto> {
    // 404 if not theirs, 400 if already paid/cancelled.
    const order = await this.getPayableOrderUseCase.execute(id, userId);
    // The amount comes from OUR database, never from the browser (so nobody can pay ₹1 for a ₹999 order).
    const gatewayOrder = await this.razorpay.createOrder(order.totalAmount, order.id);
    // Remember it: verify will only accept a payment for THIS Razorpay order.
    await this.ordersRepository.setRazorpayOrderId(order.id, gatewayOrder.id);

    return {
      orderId: order.id,
      keyId: this.razorpay.publicKeyId,
      razorpayOrderId: gatewayOrder.id,
      amount: gatewayOrder.amount,
      currency: gatewayOrder.currency,
      customerName: order.customerName,
      customerEmail: order.customerEmail,
    };
  }
}
