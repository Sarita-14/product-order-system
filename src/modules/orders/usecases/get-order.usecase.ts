// ─────────────────────────────────────────────────────────────────────────────
// FILE: get-order.usecase.ts — gets ONE order, or answers 404.
// Reused by: GET /orders/:id, cancel, and the admin status update.
// ─────────────────────────────────────────────────────────────────────────────

// NotFoundException = a 404 error.
import { Injectable, NotFoundException } from '@nestjs/common';
// The Order entity (return type).
import { Order } from '../entities/order.entity';
// Database access for orders.
import { OrdersRepository } from '../repositories/orders.repository';

/**
 * Gets one order with its items, or stops with a 404 error.
 * With ownerId: someone else's order is ALSO a 404 (not 403),
 * so a customer can't even find out that the order id exists.
 */
@Injectable()
export class GetOrderUseCase {
  // Nest hands us the repository ready to use (we never create them ourselves).
  constructor(private readonly ordersRepository: OrdersRepository) {}

  // id = which order. ownerId (optional) = "it must belong to this user".
  async execute(id: string, ownerId?: string): Promise<Order> {
    // Load the order from the database (or null).
    const order = await this.ordersRepository.findById(id);
    // Not found, OR an owner was required and it isn't this user -> 404.
    if (!order || (ownerId && order.userId !== ownerId)) {
      throw new NotFoundException(`Order ${id} not found`);
    }
    // Found and allowed.
    return order;
  }
}
