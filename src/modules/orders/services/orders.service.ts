import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { DataSource, EntityManager, In } from 'typeorm';
import { toMoney } from '../../../common/transformers/decimal.transformer';
import { MailService } from '../../mail/services/mail.service';
import { Product } from '../../products/entities/product.entity';
import { User } from '../../users/entities/user.entity';
import { CreateOrderDto } from '../dto/create-order.dto';
import { OrderItem } from '../entities/order-item.entity';
import { Order } from '../entities/order.entity';
import { OrderStatus } from '../enums/order-status.enum';

@Injectable()
export class OrdersService {
  constructor(
    private readonly dataSource: DataSource,
    private readonly mailService: MailService,
  ) {}

  async create(dto: CreateOrderDto): Promise<Order> {
    const order = await this.dataSource.transaction((manager) => this.placeOrder(manager, dto));

    // After commit, fire-and-forget: an email failure must not fail the order.
    void this.mailService.sendOrderConfirmation(order);
    return order;
  }

  findAll(): Promise<Order[]> {
    return this.dataSource.getRepository(Order).find({
      relations: { items: { product: true } },
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: string): Promise<Order> {
    const order = await this.dataSource.getRepository(Order).findOne({
      where: { id },
      relations: { items: { product: true } },
    });
    if (!order) throw new NotFoundException(`Order ${id} not found`);
    return order;
  }

  private async placeOrder(manager: EntityManager, dto: CreateOrderDto): Promise<Order> {
    const user = await manager.findOneBy(User, { id: dto.userId });
    if (!user) throw new NotFoundException(`User ${dto.userId} not found`);

    const products = await this.lockProducts(manager, dto.items.map((i) => i.productId));

    const items = dto.items.map(({ productId, quantity }) => {
      const product = products.get(productId);
      if (!product) throw new NotFoundException(`Product ${productId} not found`);
      if (product.stockQuantity < quantity) {
        throw new BadRequestException(
          `Insufficient stock for "${product.name}": requested ${quantity}, available ${product.stockQuantity}`,
        );
      }

      product.stockQuantity -= quantity;
      return manager.create(OrderItem, {
        product,
        productId,
        quantity,
        unitPrice: product.price,
        subtotal: toMoney(product.price * quantity),
      });
    });

    await manager.save([...products.values()]); // stock deduction

    return manager.save(
      manager.create(Order, {
        userId: user.id,
        customerName: user.username,
        customerEmail: user.email,
        totalAmount: toMoney(items.reduce((sum, item) => sum + item.subtotal, 0)),
        status: OrderStatus.CONFIRMED,
        items,
      }),
    );
  }


  private async lockProducts(manager: EntityManager, ids: string[]): Promise<Map<string, Product>> {
    const products = await manager.find(Product, {
      where: { id: In(ids), isActive: true },
      order: { id: 'ASC' },
      lock: { mode: 'pessimistic_write' },
    });
    return new Map(products.map((p) => [p.id, p]));
  }
}