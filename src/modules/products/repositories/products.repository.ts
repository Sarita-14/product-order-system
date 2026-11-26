// ─────────────────────────────────────────────────────────────────────────────
// FILE: products.repository.ts — the ONLY place that reads/writes the products table.
//
// CONCEPT — "repository": the class that talks to the database for one table.
//   Use cases call it; they never write database queries themselves.
//
// CONCEPT — "transaction" + "EntityManager": a transaction groups several
//   database changes so they ALL succeed or ALL are undone. Methods that take a
//   `manager` run inside the caller's transaction.
// ─────────────────────────────────────────────────────────────────────────────

// @Injectable = Nest may create this class for us and hand it to any class that asks for it.
import { Injectable } from '@nestjs/common';
// InjectRepository = asks for TypeORM's ready-made helper for one table.
import { InjectRepository } from '@nestjs/typeorm';
// EntityManager = sends commands to the database (also inside a transaction). ILike = a search that ignores capital/small letters.
// In = "value is one of this list". Repository = TypeORM's ready-made table helper.
import { EntityManager, ILike, In, Repository } from 'typeorm';
// Shapes of the create / update data.
import { CreateProductDto } from '../dto/create-product.dto';
import { UpdateProductDto } from '../dto/update-product.dto';
// The products table.
import { Product } from '../entities/product.entity';

@Injectable()
export class ProductsRepository {
  constructor(
    // TypeORM's helper for the products table, given to us by Nest.
    @InjectRepository(Product)
    private readonly repo: Repository<Product>,
  ) {}

  // Insert a new product row and return it (with its new id).
  create(data: CreateProductDto): Promise<Product> {
    // repo.create = build the object; repo.save = add it to the database as a new row.
    return this.repo.save(this.repo.create(data));
  }

  /**
   * Active products only; deleted (hidden) ones are left out.
   * With `search`: find products whose name OR description contains the text (capital/small letters don't matter).
   */
  findAllActive(search?: string): Promise<Product[]> {
    // In a database search, % means "any text" and _ means "any one letter". We put a \ in front of them so searching "50%" looks for the real text "50%".
    // pattern = "%text%" ("contains text"), or undefined when there's no search.
    const pattern = search && `%${search.replace(/[\\%_]/g, '\\$&')}%`;
    // Ask the database for the products...
    return this.repo.find({
      where: pattern
        ? [
            // an array in `where` means OR
            { isActive: true, name: ILike(pattern) }, // name contains the text
            { isActive: true, description: ILike(pattern) }, // OR description contains it
          ]
        : { isActive: true }, // no search: every active product
      order: { createdAt: 'DESC' }, // newest first
    });
  }

  // One active product by id, or null if there is none.
  findActiveById(id: string): Promise<Product | null> {
    return this.repo.findOneBy({ id, isActive: true });
  }

  // Copy the changes onto the product (merge) and save (UPDATE) it.
  update(product: Product, changes: UpdateProductDto): Promise<Product> {
    return this.repo.save(this.repo.merge(product, changes));
  }

  /** Soft delete = hide it, don't erase it: the row stays so old orders still point to it. */
  async deactivate(id: string): Promise<void> {
    // In the database: set is_active to false for the product with this id (it becomes hidden).
    await this.repo.update(id, { isActive: false });
  }

  // Inside a transaction: load these products AND lock their rows, so two orders
  // at the same moment can't both take the last item. Others wait until we finish.
  findActiveByIdsForUpdate(
    manager: EntityManager,
    ids: string[],
  ): Promise<Product[]> {
    return manager.find(Product, {
      where: { id: In(ids), isActive: true }, // id is in the list, and active
      order: { id: 'ASC' }, // always lock in the same order, so two orders never wait for each other forever
      lock: { mode: 'pessimistic_write' }, // lock these rows: anyone else must wait until we finish
    });
  }

  // Save several changed products at once, inside the caller's transaction.
  saveAll(manager: EntityManager, products: Product[]): Promise<Product[]> {
    return manager.save(products);
  }

  /**
   * Gives stock back (order cancelled). For each item the database does "stock = stock + quantity",
   * which the database does in ONE single step, so nothing can sneak in between (no extra lock needed).
   */
  async restoreStock(
    manager: EntityManager, // the cancel transaction
    items: { productId: string; quantity: number }[], // what to give back
  ): Promise<void> {
    // "for ... of" = repeat for each item. { productId, quantity } takes those two fields out.
    for (const { productId, quantity } of items) {
      // In the database: add `quantity` to this product's stock.
      await manager.increment(Product, { id: productId }, 'stockQuantity', quantity);
    }
  }
}
