// ─────────────────────────────────────────────────────────────────────────────
// FILE: place-order.usecase.ts — places a new order.
// Steps: find the customer -> (transaction: lock products, check stock,
// deduct stock, save order) -> send the email.
// ─────────────────────────────────────────────────────────────────────────────

// BadRequestException = a 400 error; Injectable = Nest may create this class for us; NotFoundException = a 404 error.
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
// Runs queries inside the transaction.
import { EntityManager } from 'typeorm';
// toMoney: rounds to 2 decimals (avoids 0.1 + 0.2 = 0.30000000000000004).
import { toMoney } from '../../../common/transformers/decimal.transformer';
// Sends emails.
import { MailService } from '../../mail/services/mail.service';
// Database access for products.
import { ProductsRepository } from '../../products/repositories/products.repository';
// The User entity (type).
import { User } from '../../users/entities/user.entity';
// Finds users (404 if missing).
import { UsersService } from '../../users/services/users.service';
// The body shape: { items: [{ productId, quantity }] }.
import { CreateOrderDto } from '../dto/create-order.dto';
// The Order entity (return type).
import { Order } from '../entities/order.entity';
// The statuses.
import { OrderStatus } from '../enums/order-status.enum';
// Database access for orders.
import { OrdersRepository } from '../repositories/orders.repository';

@Injectable()
export class PlaceOrderUseCase {
  // Nest hands us the four helpers ready to use (we never create them ourselves).
  constructor(
    private readonly ordersRepository: OrdersRepository,
    private readonly productsRepository: ProductsRepository,
    private readonly usersService: UsersService,
    private readonly mailService: MailService,
  ) {}

  // userId comes from the token (see OrdersController), never from the body
  async execute(userId: string, dto: CreateOrderDto): Promise<Order> {
    // Reuse UsersService: stops with a 404 error if the customer doesn't exist (before any locking)
    const user = await this.usersService.findOne(userId);

    // Do the real work inside ONE transaction (all saved together, or nothing).
    const order = await this.ordersRepository.transaction((manager) =>
      this.placeOrder(manager, user, dto),
    );

    // "void" = send the email in the background; don't make the customer wait for it.
    void this.mailService.sendOrderConfirmation(order);
    // Answer with the new order.
    return order;
  }

  // The steps that must run inside the transaction.
  private async placeOrder(
    manager: EntityManager,
    user: User,
    dto: CreateOrderDto,
  ): Promise<Order> {
    // Load + lock every product in the order (others wait until we finish).
    const locked = await this.productsRepository.findActiveByIdsForUpdate(
      manager,
      dto.items.map((item) => item.productId), // just the ids
    );
    // A Map = a quick lookup "id -> product".
    const products = new Map(locked.map((p) => [p.id, p]));

    // Check every item, then deduct stock in memory (nothing is written yet)
    const items = dto.items.map(({ productId, quantity }) => {
      // Find the product for this line.
      const product = products.get(productId);
      // Not found (or deleted) -> 404; stopping with an error undoes the whole transaction.
      if (!product)
        throw new NotFoundException(`Product ${productId} not found`);
      // Not enough stock -> 400.
      if (product.stockQuantity < quantity) {
        throw new BadRequestException(
          `Insufficient stock for "${product.name}": requested ${quantity}, available ${product.stockQuantity}`,
        );
      }

      // Take the quantity out of the stock (in memory for now).
      product.stockQuantity -= quantity;
      // The order line to save.
      return {
        product,
        productId,
        quantity,
        unitPrice: product.price, // the price copied now: later price changes won't touch this order
        subtotal: toMoney(product.price * quantity), // line total
      };
    });

    await this.productsRepository.saveAll(manager, locked); // stock deduction

    // Save the order with its lines and return it.
    return this.ordersRepository.create(manager, {
      userId: user.id,
      customerName: user.username, // copied now: won't change if the user edits their profile later
      customerEmail: user.email, // copied now: won't change if the user edits their profile later
      // Sum of all line totals ("reduce" = add them up one by one, starting at 0).
      totalAmount: toMoney(items.reduce((sum, item) => sum + item.subtotal, 0)),
      status: OrderStatus.PENDING, // becomes CONFIRMED once paid
      items,
    });
  }
}
