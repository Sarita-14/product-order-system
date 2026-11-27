// ─────────────────────────────────────────────────────────────────────────────
// FILE: cart.repository.ts — the ONLY place that reads/writes the cart_items table.
// (What a repository / transaction is: see products/repositories/products.repository.ts.)
// ─────────────────────────────────────────────────────────────────────────────

// @Injectable = Nest may create this class for us and hand it to any class that asks for it.
import { Injectable } from '@nestjs/common';
// Asks TypeORM for the ready-made helper of one table.
import { InjectRepository } from '@nestjs/typeorm';
// DataSource = the database connection (to start transactions); EntityManager = runs queries in one.
import { DataSource, EntityManager, Repository } from 'typeorm';
// The users table (only to lock the customer's row, see lockCustomer).
import { User } from '../../users/entities/user.entity';
// The cart_items table.
import { CartItem } from '../entities/cart-item.entity';

@Injectable()
export class CartRepository {
  constructor(
    // TypeORM's helper for the cart_items table.
    @InjectRepository(CartItem)
    private readonly repo: Repository<CartItem>,
    // The database connection.
    private readonly dataSource: DataSource,
  ) {}

  // Run `work` inside ONE transaction (all its changes saved together, or none).
  transaction<T>(work: (manager: EntityManager) => Promise<T>): Promise<T> {
    return this.dataSource.transaction(work);
  }

  // Lock this customer's row until the transaction ends, so two cart changes of the SAME
  // customer (e.g. a double click) run one after the other and never count twice.
  // Every cart transaction calls this FIRST, then locks products: always the same order,
  // so two transactions can never wait for each other forever.
  async lockCustomer(manager: EntityManager, userId: string): Promise<void> {
    await manager.findOne(User, { where: { id: userId }, lock: { mode: 'pessimistic_write' } });
  }

  // The customer's cart lines with their products, oldest first. Pass `manager` inside a transaction.
  findByUser(userId: string, manager: EntityManager = this.repo.manager): Promise<CartItem[]> {
    return manager.find(CartItem, { where: { userId }, relations: { product: true }, order: { createdAt: 'ASC' } });
  }

  // One line of the cart (or null), inside a transaction.
  findItem(manager: EntityManager, userId: string, productId: string): Promise<CartItem | null> {
    return manager.findOneBy(CartItem, { userId, productId });
  }

  // Set a line's quantity: creates the line if it's new, updates it otherwise.
  async saveQuantity(manager: EntityManager, item: CartItem | null, userId: string, productId: string, quantity: number) {
    // Existing line -> change its quantity; new -> build one ("??" = use the right side when null).
    const line = item ?? manager.create(CartItem, { userId, productId });
    line.quantity = quantity;
    await manager.save(line);
  }

  // Delete one line.
  async remove(manager: EntityManager, item: CartItem): Promise<void> {
    await manager.remove(item);
  }

  // Empty the customer's cart (after the order is placed).
  async clear(manager: EntityManager, userId: string): Promise<void> {
    await manager.delete(CartItem, { userId });
  }
}
