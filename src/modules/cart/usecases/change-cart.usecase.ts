// ─────────────────────────────────────────────────────────────────────────────
// FILE: change-cart.usecase.ts — add to the cart, or set a quantity (0 = remove).
//
// The stock moves WITH the cart (the customer's items are reserved for them):
//   quantity goes up by N   -> products.stock_quantity goes down by N
//   quantity goes down by N -> products.stock_quantity goes up by N
// Both changes happen in ONE transaction: they succeed together or not at all.
// ─────────────────────────────────────────────────────────────────────────────

// BadRequestException = 400; NotFoundException = 404.
import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
// Runs queries inside the transaction.
import { EntityManager } from 'typeorm';
// Database access for products (lock, save, give stock back).
import { ProductsRepository } from '../../products/repositories/products.repository';
// The CartItem entity (return type).
import { CartItem } from '../entities/cart-item.entity';
// Database access for the cart.
import { CartRepository } from '../repositories/cart.repository';

@Injectable()
export class ChangeCartUseCase {
  // Nest hands us the repositories ready to use.
  constructor(
    private readonly cartRepository: CartRepository,
    private readonly productsRepository: ProductsRepository,
  ) {}

  // "Add to cart": one more of this product.
  add(userId: string, productId: string): Promise<CartItem[]> {
    return this.change(userId, productId, (current) => current + 1);
  }

  // Cart page: this exact quantity (0 = remove).
  set(userId: string, productId: string, quantity: number): Promise<CartItem[]> {
    return this.change(userId, productId, () => quantity);
  }

  // The shared core of add() and set(). next = "given the current quantity, what should it become?"
  // Returns the whole cart afterwards (so the page can redraw it).
  private async change(userId: string, productId: string, next: (current: number) => number): Promise<CartItem[]> {
    await this.cartRepository.transaction((manager) => this.changeInside(manager, userId, productId, next));
    return this.cartRepository.findByUser(userId);
  }

  // The steps that must run inside the transaction.
  private async changeInside(
    manager: EntityManager,
    userId: string,
    productId: string,
    next: (current: number) => number,
  ): Promise<void> {
    // 1. Lock the customer, then the product (always this order; see cart.repository.ts).
    await this.cartRepository.lockCustomer(manager, userId);
    // [product] = the first (and only) element of the list; undefined if deleted/hidden.
    const [product] = await this.productsRepository.findActiveByIdsForUpdate(manager, [productId]);
    const item = await this.cartRepository.findItem(manager, userId, productId);

    // 2. How much changes? diff > 0 = take from stock; diff < 0 = give back.
    const current = item?.quantity ?? 0;
    const target = next(current);
    const diff = target - current;

    if (diff > 0) {
      // Taking more: the product must exist and have enough left.
      if (!product) throw new NotFoundException(`Product ${productId} not found`);
      if (product.stockQuantity < diff) {
        throw new BadRequestException(
          product.stockQuantity === 0
            ? `"${product.name}" is out of stock`
            : `Only ${product.stockQuantity} more "${product.name}" in stock`,
        );
      }
      product.stockQuantity -= diff; // reserve
      await this.productsRepository.saveAll(manager, [product]);
    } else if (diff < 0) {
      // Giving back (also works for a product that was hidden meanwhile).
      await this.productsRepository.restoreStock(manager, [{ productId, quantity: -diff }]);
    }

    // 3. Save the cart line: 0 -> delete it; otherwise create/update it.
    if (target === 0) {
      if (item) await this.cartRepository.remove(manager, item);
    } else {
      await this.cartRepository.saveQuantity(manager, item, userId, productId, target);
    }
  }
}
