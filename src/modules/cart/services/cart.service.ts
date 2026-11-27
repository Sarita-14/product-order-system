// ─────────────────────────────────────────────────────────────────────────────
// FILE: cart.service.ts — the middle layer between the controller and the use cases.
// (What a service is: see orders/services/orders.service.ts.)
// ─────────────────────────────────────────────────────────────────────────────

// @Injectable = Nest may create this class for us and hand it to any class that asks for it.
import { Injectable } from '@nestjs/common';
// The Order entity (return type of checkout).
import { Order } from '../../orders/entities/order.entity';
// The CartItem entity (return type).
import { CartItem } from '../entities/cart-item.entity';
// The use cases.
import { ChangeCartUseCase } from '../usecases/change-cart.usecase';
import { CheckoutCartUseCase } from '../usecases/checkout-cart.usecase';
import { GetCartUseCase } from '../usecases/get-cart.usecase';

@Injectable()
export class CartService {
  // Nest hands us the use cases ready to use.
  constructor(
    private readonly getCartUseCase: GetCartUseCase,
    private readonly changeCartUseCase: ChangeCartUseCase,
    private readonly checkoutCartUseCase: CheckoutCartUseCase,
  ) {}

  // My cart.
  find(userId: string): Promise<CartItem[]> {
    return this.getCartUseCase.execute(userId);
  }

  // One more of a product (stock -1).
  add(userId: string, productId: string): Promise<CartItem[]> {
    return this.changeCartUseCase.add(userId, productId);
  }

  // An exact quantity (stock moves by the difference; 0 removes).
  set(userId: string, productId: string, quantity: number): Promise<CartItem[]> {
    return this.changeCartUseCase.set(userId, productId, quantity);
  }

  // The whole cart -> one order.
  checkout(userId: string): Promise<Order> {
    return this.checkoutCartUseCase.execute(userId);
  }
}
