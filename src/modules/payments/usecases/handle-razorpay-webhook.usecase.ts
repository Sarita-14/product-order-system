// ─────────────────────────────────────────────────────────────────────────────
// FILE: handle-razorpay-webhook.usecase.ts — Razorpay tells US about a payment.
//
// CONCEPT — "webhook": instead of us asking Razorpay "is it paid yet?", Razorpay
//   sends an HTTP request to our backend whenever something happens. This is the
//   safety net for when the customer closes the tab right after paying (so the
//   browser never sends /verify).
//
// Razorpay may send the same event more than once (it retries until we answer 200).
// That's safe here: every change is "only if the status is still X", so a
// repeated event simply changes nothing.
// ─────────────────────────────────────────────────────────────────────────────

// Logger = writes messages to the server terminal.
import { Injectable, Logger } from '@nestjs/common';
// Statuses + which ones can be paid.
import { OrderStatus, PAYABLE_STATUSES } from '../../orders/enums/order-status.enum';
// Database access for orders.
import { OrdersRepository } from '../../orders/repositories/orders.repository';
// The event shape + which events mean "paid" / "failed".
import {
  RAZORPAY_FAILED_EVENT,
  RAZORPAY_PAID_EVENTS,
  type RazorpayWebhookEvent,
} from '../interfaces/razorpay-webhook-event.interface';

@Injectable()
export class HandleRazorpayWebhookUseCase {
  // Messages in the terminal are labelled with this class name.
  private readonly logger = new Logger(HandleRazorpayWebhookUseCase.name);

  // Nest hands us the repository ready to use.
  constructor(private readonly ordersRepository: OrdersRepository) {}

  // event = the JSON body (its signature was already checked by the controller).
  async execute(event: RazorpayWebhookEvent): Promise<void> {
    // "?." = stop with undefined if any step is missing (events without a payment, e.g. refunds).
    const payment = event.payload?.payment?.entity;
    if (!payment) return; // nothing for us -> ignore (we still answer 200)

    // Which of OUR orders is this? We saved Razorpay's order id when Pay was clicked.
    const order = await this.ordersRepository.findByRazorpayOrderId(payment.order_id);
    if (!order) {
      this.logger.warn(`Webhook for unknown Razorpay order ${payment.order_id}; ignored`);
      return;
    }

    if (RAZORPAY_PAID_EVENTS.includes(event.event)) {
      // Paid -> CONFIRMED (only if still PENDING/FAILED; already CONFIRMED -> nothing happens).
      const confirmed = await this.ordersRepository.confirmPayment(order.id, PAYABLE_STATUSES, payment.id);
      // Money arrived for an order that was CANCELLED meanwhile: a person must refund it.
      if (!confirmed && order.status === OrderStatus.CANCELLED) {
        this.logger.warn(`Order ${order.id} was paid (${payment.id}) after being cancelled: refund it in Razorpay`);
      }
    } else if (event.event === RAZORPAY_FAILED_EVENT) {
      // Failed -> FAILED, but only from PENDING (never undo a later successful retry).
      await this.ordersRepository.changeStatus(order.id, [OrderStatus.PENDING], OrderStatus.FAILED);
    }
    // Any other event: ignored.
  }
}
