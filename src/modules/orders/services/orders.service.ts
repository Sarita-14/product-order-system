import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { Order } from '../entities/order.entity';
import { OrderItem } from '../entities/order-item.entity';
import { User } from '../../users/entities/user.entity';
import { Product } from '../../products/entities/product.entity';
import { CreateOrderDto } from '../dto/create-order.dto';
import { OrderStatus } from '../enums/order-status.enum';
import { MailService } from '../../mail/services/mail.service';

@Injectable()
export class OrdersService {
  constructor(
    private readonly dataSource: DataSource,
    private readonly mailService: MailService,
  ) {}

  async create(dto: CreateOrderDto): Promise<Order> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // 1. Verify User
      const user = await queryRunner.manager.findOne<User>(User, { where: { id: dto.userId } });
      if (!user) {
        throw new NotFoundException(`User #${dto.userId} not found`);
      }

      let totalAmount = 0;
      const orderItemsToSave: OrderItem[] = [];
      const emailItems: Array<{ name: string; quantity: number; unitPrice: number; subtotal: number }> = [];

      // 2. Validate and Deduct Stock for each Product
      for (const item of dto.items) {
        const product = await queryRunner.manager.findOne<Product>(Product, {
          where: { id: item.productId, isActive: true },
        });

        if (!product) {
          throw new NotFoundException(`Product #${item.productId} not found or inactive`);
        }

        if (product.stockQuantity < item.quantity) {
          throw new BadRequestException(
            `Insufficient stock for product "${product.name}". Available: ${product.stockQuantity}`,
          );
        }

        // Deduct Stock
        product.stockQuantity -= item.quantity;
        await queryRunner.manager.save(product);

        const unitPrice = Number(product.price);
        const subtotal = unitPrice * item.quantity;
        totalAmount += subtotal;

        const orderItem = new OrderItem();
        orderItem.productId = product.id;
        orderItem.quantity = item.quantity;
        orderItem.unitPrice = unitPrice;
        orderItem.subtotal = subtotal;

        orderItemsToSave.push(orderItem);
        emailItems.push({
          name: product.name,
          quantity: item.quantity,
          unitPrice,
          subtotal,
        });
      }

      // 3. Create and Save Order
      const order = new Order();
      order.userId = user.id;
      order.customerName = user.username;
      order.customerEmail = user.email;
      order.totalAmount = totalAmount;
      order.status = OrderStatus.CONFIRMED;

      const savedOrder = await queryRunner.manager.save(order);

      // 4. Attach orderId and Save Order Items
      for (const item of orderItemsToSave) {
        item.orderId = savedOrder.id;
      }
      await queryRunner.manager.save(OrderItem, orderItemsToSave);

      await queryRunner.commitTransaction();

      // 5. Send Email Asynchronously
      this.mailService.sendOrderConfirmation(
        savedOrder.customerEmail,
        savedOrder.customerName,
        savedOrder.id,
        savedOrder.totalAmount,
        emailItems,
      );

      savedOrder.items = orderItemsToSave;
      return savedOrder;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async findAll(): Promise<Order[]> {
    return this.dataSource.getRepository(Order).find({
      relations: { items: { product: true }, user: true },
    });
  }

  async findOne(id: string): Promise<Order> {
    const order = await this.dataSource.getRepository(Order).findOne({
      where: { id },
      relations: { items: { product: true }, user: true },
    });
    if (!order) {
      throw new NotFoundException(`Order #${id} not found`);
    }
    return order;
  }
}