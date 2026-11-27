// ─────────────────────────────────────────────────────────────────────────────
// FILE: checkout-cart.usecase.ts — "Place order" on the checkout page.
// Turns the whole cart into ONE order (status PENDING) and empties the cart.
// The stock is NOT taken again: it was reserved when the items went into the cart.
// Steps: find the customer -> (transaction: lock, read cart, create order, empty cart) -> email.
// ─────────────────────────────────────────────────────────────────────────────

// BadRequestException = a 400 error.
import { BadRequestException, Injectable } from '@nestjs/common';
// Sends emails.
import { MailService } from '../../mail/services/mail.service';
// The Order entity (return type).
import { Order } from '../../orders/entities/order.entity';
// Reused: builds and saves an order (here with stockReserved = true).
import { PlaceOrderUseCase } from '../../orders/usecases/place-order.usecase';
// Finds users (404 if missing).
import { UsersService } from '../../users/services/users.service';
// Database access for the cart.
import { CartRepository } from '../repositories/cart.repository';

@Injectable()
export class CheckoutCartUseCase {
  // Nest hands us the helpers ready to use.
  constructor(
    private readonly cartRepository: CartRepository,
    private readonly placeOrderUseCase: PlaceOrderUseCase,
    private readonly usersService: UsersService,
    private readonly mailService: MailService,
  ) {}

  // userId = from the token.
  async execute(userId: string): Promise<Order> {
    const user = await this.usersService.findOne(userId); // 404 if the account is gone

    // ONE transaction: the order is saved AND the cart emptied, or neither.
    const order = await this.cartRepository.transaction(async (manager) => {
      // Same lock order as the cart changes: customer first (see cart.repository.ts).
      await this.cartRepository.lockCustomer(manager, userId);
      const lines = await this.cartRepository.findByUser(userId, manager);
      if (lines.length === 0) throw new BadRequestException('Your cart is empty');
      // true = stock already reserved: don't check or deduct it again.
      const created = await this.placeOrderUseCase.createOrder(manager, user, lines, true);
      await this.cartRepository.clear(manager, userId);
      return created;
    });

    // "void" = send the email in the background; don't make the customer wait for it.
    void this.mailService.sendOrderConfirmation(order);
    return order;
  }
}
