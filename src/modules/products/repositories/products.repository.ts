import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, ILike, In, Repository } from 'typeorm';
import { CreateProductDto } from '../dto/create-product.dto';
import { UpdateProductDto } from '../dto/update-product.dto';
import { Product } from '../entities/product.entity';

@Injectable()
export class ProductsRepository {
  constructor(
    @InjectRepository(Product)
    private readonly repo: Repository<Product>,
  ) {}

  create(data: CreateProductDto): Promise<Product> {
    return this.repo.save(this.repo.create(data));
  }

  /**
   * Active products only; soft-deleted ones are hidden.
   * With `search`: case-insensitive match on name OR description.
   */
  findAllActive(search?: string): Promise<Product[]> {
    // % and _ are wildcards in LIKE; escape them so "50%" searches for "50%"
    const pattern = search && `%${search.replace(/[\\%_]/g, '\\$&')}%`;
    return this.repo.find({
      where: pattern
        ? [
            // an array in `where` means OR
            { isActive: true, name: ILike(pattern) },
            { isActive: true, description: ILike(pattern) },
          ]
        : { isActive: true },
      order: { createdAt: 'DESC' },
    });
  }

  findActiveById(id: string): Promise<Product | null> {
    return this.repo.findOneBy({ id, isActive: true });
  }

  update(product: Product, changes: UpdateProductDto): Promise<Product> {
    return this.repo.save(this.repo.merge(product, changes));
  }

  /** Soft delete: the row stays so old orders still point to it. */
  async deactivate(id: string): Promise<void> {
    await this.repo.update(id, { isActive: false });
  }

  findActiveByIdsForUpdate(
    manager: EntityManager,
    ids: string[],
  ): Promise<Product[]> {
    return manager.find(Product, {
      where: { id: In(ids), isActive: true },
      order: { id: 'ASC' },
      lock: { mode: 'pessimistic_write' },
    });
  }

  saveAll(manager: EntityManager, products: Product[]): Promise<Product[]> {
    return manager.save(products);
  }
}