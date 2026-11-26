// ─────────────────────────────────────────────────────────────────────────────
// FILE: get-orders.usecase.ts — lists orders.
// (What a use case is: see auth/usecases/login.usecase.ts.)
// Reused for BOTH "all orders" (admin, no userId) and "my orders" (with userId).
// ─────────────────────────────────────────────────────────────────────────────

// @Injectable = Nest may create this class for us and hand it to any class that asks for it.
import { Injectable } from '@nestjs/common';
// The Order entity (return type).
import { Order } from '../entities/order.entity';
// Database access for orders.
import { OrdersRepository } from '../repositories/orders.repository';

/** Lists orders with their items, newest first: all of them, or one customer's. */
@Injectable()
export class GetOrdersUseCase {
  // Nest hands us the repository ready to use (we never create them ourselves).
  constructor(private readonly ordersRepository: OrdersRepository) {}

  // userId given -> that customer's orders; not given -> every order.
  execute(userId?: string): Promise<Order[]> {
    return this.ordersRepository.findAll(userId);
  }
}
