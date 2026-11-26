// ─────────────────────────────────────────────────────────────────────────────
// FILE: orders.repository.ts — the ONLY place that reads/writes the orders table.
// (What a repository / transaction is: see products.repository.ts.)
// ─────────────────────────────────────────────────────────────────────────────

// @Injectable = Nest may create this class for us and hand it to any class that asks for it.
import { Injectable } from '@nestjs/common';
// Asks TypeORM for the ready-made repository of an entity.
import { InjectRepository } from '@nestjs/typeorm';
// DataSource = the database connection (to start transactions).
// DeepPartial = "an object with some of Order's fields". EntityManager = runs queries.
// In = "value is one of this list". Repository = the table helper.
import { DataSource, DeepPartial, EntityManager, In, Repository } from 'typeorm';
// The orders table.
import { Order } from '../entities/order.entity';
// The list of statuses.
import { OrderStatus } from '../enums/order-status.enum';

// Every order we return comes with its items and each item's product (for the name).
// Written once here and reused by both find methods below.
const WITH_ITEMS = { items: { product: true } } as const;

@Injectable()
export class OrdersRepository {
  constructor(
    // TypeORM's helper for the orders table.
    @InjectRepository(Order)
    private readonly repo: Repository<Order>,
    // The database connection.
    private readonly dataSource: DataSource,
  ) {}

  // Run `work` inside ONE transaction: all its changes are saved together,
  // or, if anything fails with an error, all of them are undone.
  transaction<T>(work: (manager: EntityManager) => Promise<T>): Promise<T> {
    return this.dataSource.transaction(work);
  }

  // Insert a new order (and its items, because order.entity.ts has cascade: true) inside a transaction.
  create(manager: EntityManager, data: DeepPartial<Order>): Promise<Order> {
    return manager.save(manager.create(Order, data));
  }

  /** Newest first. With userId: only that customer's orders. */
  findAll(userId?: string): Promise<Order[]> {
    return this.repo.find({
      where: userId ? { userId } : {}, // with a userId -> filter; without -> everything
      relations: WITH_ITEMS, // also load items + products
      order: { createdAt: 'DESC' }, // newest first
    });
  }

  // One order (with items + products), or null if there is none.
  findById(id: string): Promise<Order | null> {
    return this.repo.findOne({ where: { id }, relations: WITH_ITEMS });
  }

  /**
   * Sets the status ONLY IF the order is still in one of `from`, in one UPDATE.
   * Returns false when it wasn't (someone changed it a moment ago), so two
   * clicks can never both succeed. Pass `manager` to run inside a transaction.
   */
  async changeStatus(
    id: string, // which order
    from: OrderStatus[], // the statuses it must currently have
    to: OrderStatus, // the new status
    manager: EntityManager = this.repo.manager, // "= ..." = default when not given: no transaction
  ): Promise<boolean> {
    // In the database: change this order's status to `to`, BUT only if its status is still one of `from`.
    const result = await manager.update(
      Order,
      { id, status: In(from) },
      { status: to },
    );
    // affected = how many rows changed: 1 = it worked, 0 = the status didn't match.
    return result.affected === 1;
  }
}
