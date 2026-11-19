import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, DeepPartial, EntityManager, Repository } from 'typeorm';
import { Order } from '../entities/order.entity';

@Injectable()
export class OrdersRepository {
  constructor(
    @InjectRepository(Order)
    private readonly repo: Repository<Order>,
    private readonly dataSource: DataSource,
  ) {}

  transaction<T>(work: (manager: EntityManager) => Promise<T>): Promise<T> {
    return this.dataSource.transaction(work);
  }

  create(manager: EntityManager, data: DeepPartial<Order>): Promise<Order> {
    return manager.save(manager.create(Order, data));
  }

  findAll(): Promise<Order[]> {
    return this.repo.find({
      relations: { items: { product: true } },
      order: { createdAt: 'DESC' },
    });
  }

  findById(id: string): Promise<Order | null> {
    return this.repo.findOne({
      where: { id },
      relations: { items: { product: true } },
    });
  }
}
