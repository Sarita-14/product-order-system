// ─────────────────────────────────────────────────────────────────────────────
// FILE: cancel-order.usecase.ts — the customer cancels their own order.
// Rules: only their OWN order, only while PENDING or FAILED,
// and the stock goes back — all in ONE transaction.
// ─────────────────────────────────────────────────────────────────────────────

// BadRequestException = a 400 error.
import { BadRequestException, Injectable } from '@nestjs/common';
// Database access for products (to give the stock back).
import { ProductsRepository } from '../../products/repositories/products.repository';
// The Order entity (return type).
import { Order } from '../entities/order.entity';
// The statuses and the "which statuses can be cancelled" rule.
import { CANCELLABLE_STATUSES, OrderStatus } from '../enums/order-status.enum';
// Database access for orders.
import { OrdersRepository } from '../repositories/orders.repository';
// Reused: load an order + 404 check.
import { GetOrderUseCase } from './get-order.usecase';

/** The customer cancels their own PENDING/FAILED order; the stock goes back. */
@Injectable()
export class CancelOrderUseCase {
  // Nest hands us the three helpers ready to use (we never create them ourselves).
  constructor(
    private readonly getOrderUseCase: GetOrderUseCase,
    private readonly ordersRepository: OrdersRepository,
    private readonly productsRepository: ProductsRepository,
  ) {}

  // id = which order; userId = who is asking (from the token).
  async execute(id: string, userId: string): Promise<Order> {
    const order = await this.getOrderUseCase.execute(id, userId); // 404 if not theirs

    // ONE transaction: the status change and the stock restore succeed or fail together
    await this.ordersRepository.transaction(async (manager) => {
      // Set CANCELLED only if it is still PENDING/FAILED (true = it worked).
      const cancelled = await this.ordersRepository.changeStatus(
        id,
        CANCELLABLE_STATUSES,
        OrderStatus.CANCELLED,
        manager, // inside this transaction
      );
      // Not cancellable (e.g. already CONFIRMED) -> 400. Stopping with an error also undoes the whole transaction.
      if (!cancelled) {
        throw new BadRequestException(
          `Only ${CANCELLABLE_STATUSES.join(' or ')} orders can be cancelled`,
        );
      }
      // Give each item's quantity back to its product.
      await this.productsRepository.restoreStock(manager, order.items);
    });

    // Load the order again so the answer shows the new status.
    return this.getOrderUseCase.execute(id);
  }
}
