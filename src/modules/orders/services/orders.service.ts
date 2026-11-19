import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
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
    //we are using DataSource: To communicate with the database, MailService: To send emails.
  ) {}

  async create(dto: CreateOrderDto): Promise<Order> {
    const order = await this.dataSource.transaction((manager) => this.placeOrder(manager, dto));
//transaction krne ke liye //Check user.
// Check products.
// Deduct stock.
// Save order.
// Save order items
    void this.mailService.sendOrderConfirmation(order);
    //transaction done then it will confirmation email dega 
    return order;
    //return create order 
  }

  findAll(): Promise<Order[]> {
    return this.dataSource.getRepository(Order).find({
      relations: { items: { product: true } },
      order: { createdAt: 'DESC' },
    });
    //method fetches all orders from the database
  }
//ye ek  order k liye 
  async findOne(id: string): Promise<Order> {
    const order = await this.dataSource.getRepository(Order).findOne({
      where: { id },
      relations: { items: { product: true } },
    });
    if (!order) throw new NotFoundException(`Order ${id} not found`);
    return order;
  }
//main logic 
  private async placeOrder(manager: EntityManager, dto: CreateOrderDto): Promise<Order> {
    //Check whether the user exists
    const user = await manager.findOneBy(User, { id: dto.userId });
    if (!user) throw new NotFoundException(`User ${dto.userId} not found`);
//user.repo file 
    const productIds = dto.items.map((item) => item.productId);

if (new Set(productIds).size !== productIds.length) {
  throw new ConflictException(
    'Duplicate products are not allowed in the same order',
  );
}

const products = await this.lockProducts(manager, productIds);

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
//creates the main Order record
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

//Only active products are selected
  private async lockProducts(manager: EntityManager, ids: string[]): Promise<Map<string, Product>> {
    const products = await manager.find(Product, {
      where: { id: In(ids), isActive: true },
      order: { id: 'ASC' },
      lock: { mode: 'pessimistic_write' },
    });
    return new Map(products.map((p) => [p.id, p]));
  }
}