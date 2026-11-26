// ─────────────────────────────────────────────────────────────────────────────
// FILE: update-order-status.usecase.ts — the admin moves an order forward.
// Allowed: CONFIRMED -> SHIPPED -> DELIVERED. Anything else answers 400.
// ─────────────────────────────────────────────────────────────────────────────

// BadRequestException = a 400 error.
import { BadRequestException, Injectable } from '@nestjs/common';
// The Order entity (return type).
import { Order } from '../entities/order.entity';
// The statuses and the "allowed next status" table.
import { NEXT_ADMIN_STATUS, OrderStatus } from '../enums/order-status.enum';
// Database access for orders.
import { OrdersRepository } from '../repositories/orders.repository';
// Reused: load an order + 404 check.
import { GetOrderUseCase } from './get-order.usecase';

/** Admin moves an order forward: CONFIRMED -> SHIPPED -> DELIVERED. Anything else is 400. */
@Injectable()
export class UpdateOrderStatusUseCase {
  // Nest hands us the helpers ready to use (we never create them ourselves).
  constructor(
    private readonly getOrderUseCase: GetOrderUseCase,
    private readonly ordersRepository: OrdersRepository,
  ) {}

  // id = which order; status = the new status the admin chose.
  async execute(id: string, status: OrderStatus): Promise<Order> {
    const order = await this.getOrderUseCase.execute(id); // 404 if missing
    // allowed is true only if BOTH are true ("&&"):
    //  1. the rule table says this move is allowed from the current status, and
    //  2. the database update really happened (nobody changed it a moment ago).
    // Because of "&&", step 2 doesn't even run when step 1 is false.
    const allowed =
      NEXT_ADMIN_STATUS[order.status] === status &&
      (await this.ordersRepository.changeStatus(id, [order.status], status));

    // Not allowed -> 400 with a clear message.
    if (!allowed) {
      throw new BadRequestException(
        `Cannot change an order from ${order.status} to ${status}`,
      );
    }
    // Load it again so the answer shows the new status.
    return this.getOrderUseCase.execute(id);
  }
}
