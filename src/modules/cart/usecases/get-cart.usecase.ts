// ─────────────────────────────────────────────────────────────────────────────
// FILE: get-cart.usecase.ts — the logged-in customer's cart lines (with products).
// ─────────────────────────────────────────────────────────────────────────────

// @Injectable = Nest may create this class for us and hand it to any class that asks for it.
import { Injectable } from '@nestjs/common';
// The CartItem entity (return type).
import { CartItem } from '../entities/cart-item.entity';
// Database access for the cart.
import { CartRepository } from '../repositories/cart.repository';

@Injectable()
export class GetCartUseCase {
  // Nest hands us the repository ready to use.
  constructor(private readonly cartRepository: CartRepository) {}

  // userId = from the token.
  execute(userId: string): Promise<CartItem[]> {
    return this.cartRepository.findByUser(userId);
  }
}
