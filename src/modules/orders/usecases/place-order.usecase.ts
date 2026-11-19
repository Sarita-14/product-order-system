import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { EntityManager } from 'typeorm';
import { toMoney } from '../../../common/transformers/decimal.transformer';
import { MailService } from '../../mail/services/mail.service';
import { ProductsRepository } from '../../products/repositories/products.repository';
import { User } from '../../users/entities/user.entity';
import { UsersService } from '../../users/services/users.service';
import { CreateOrderDto } from '../dto/create-order.dto';
import { Order } from '../entities/order.entity';
import { OrderStatus } from '../enums/order-status.enum';
import { OrdersRepository } from '../repositories/orders.repository';

@Injectable()
export class PlaceOrderUseCase {
  constructor(
    private readonly ordersRepository: OrdersRepository,
    private readonly productsRepository: ProductsRepository,
    private readonly usersService: UsersService,
    private readonly mailService: MailService,
  ) {}

  async execute(dto: CreateOrderDto): Promise<Order> {
    // Reuse UsersService: throws 404 if the customer doesn't exist (before any locking)
    const user = await this.usersService.findOne(dto.userId);

    const order = await this.ordersRepository.transaction((manager) =>
      this.placeOrder(manager, user, dto),
    );

    void this.mailService.sendOrderConfirmation(order);
    return order;
  }

  private async placeOrder(
    manager: EntityManager,
    user: User,
    dto: CreateOrderDto,
  ): Promise<Order> {
    const locked = await this.productsRepository.findActiveByIdsForUpdate(
      manager,
      dto.items.map((item) => item.productId),
    );
    const products = new Map(locked.map((p) => [p.id, p]));

    // Check every item, then deduct stock in memory (nothing is written yet)
    const items = dto.items.map(({ productId, quantity }) => {
      const product = products.get(productId);
      if (!product)
        throw new NotFoundException(`Product ${productId} not found`);
      if (product.stockQuantity < quantity) {
        throw new BadRequestException(
          `Insufficient stock for "${product.name}": requested ${quantity}, available ${product.stockQuantity}`,
        );
      }

      product.stockQuantity -= quantity;
      return {
        product,
        productId,
        quantity,
        unitPrice: product.price, // price snapshot at order time
        subtotal: toMoney(product.price * quantity),
      };
    });

    await this.productsRepository.saveAll(manager, locked); // stock deduction

    return this.ordersRepository.create(manager, {
      userId: user.id,
      customerName: user.username,
      customerEmail: user.email,
      totalAmount: toMoney(items.reduce((sum, item) => sum + item.subtotal, 0)),
      status: OrderStatus.CONFIRMED,
      items,
    });
  }
}
