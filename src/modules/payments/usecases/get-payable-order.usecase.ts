// ─────────────────────────────────────────────────────────────────────────────
// FILE: get-payable-order.usecase.ts — "give me MY order, and it must still be unpaid".
// Shared by StartPaymentUseCase and VerifyPaymentUseCase (written once here).
// ─────────────────────────────────────────────────────────────────────────────

// BadRequestException = a 400 error.
import { BadRequestException, Injectable } from '@nestjs/common';
// The Order entity (return type).
import { Order } from '../../orders/entities/order.entity';
// Which statuses can be paid (PENDING, FAILED).
import { PAYABLE_STATUSES } from '../../orders/enums/order-status.enum';
// Reused: load an order + 404 check (also 404 for someone else's order).
import { GetOrderUseCase } from '../../orders/usecases/get-order.usecase';

@Injectable()
export class GetPayableOrderUseCase {
  // Nest hands us the use case ready to use.
  constructor(private readonly getOrderUseCase: GetOrderUseCase) {}

  // id = which order; userId = who is asking (from the token).
  async execute(id: string, userId: string): Promise<Order> {
    const order = await this.getOrderUseCase.execute(id, userId); // 404 if missing / not theirs
    // Already paid, cancelled, shipped... -> 400.
    if (!PAYABLE_STATUSES.includes(order.status)) {
      throw new BadRequestException(
        `Only ${PAYABLE_STATUSES.join(' or ')} orders can be paid (this one is ${order.status})`,
      );
    }
    return order;
  }
}
