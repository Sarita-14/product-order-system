import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Resend } from 'resend';
import { Order } from '../../orders/entities/order.entity';
import { orderConfirmationTemplate } from '../templates/order-confirmation.template';

@Injectable()
export class MailService {
  private readonly logger = new Logger(MailService.name);
  private readonly resend: Resend;
  private readonly from: string;

  constructor(config: ConfigService) {
    this.resend = new Resend(config.getOrThrow<string>('RESEND_API_KEY'));
    this.from = config.getOrThrow<string>('EMAIL_FROM');
  }

  /** Never throws: callers can fire-and-forget without risking the order. */
  async sendOrderConfirmation(order: Order): Promise<void> {
    try {
      const { subject, html } = orderConfirmationTemplate(order);
      // Resend returns { data, error } instead of throwing on API errors
      const { error } = await this.resend.emails.send({ from: this.from, to: order.customerEmail, subject, html });
      if (error) throw new Error(error.message);

      this.logger.log(`Confirmation email sent for order ${order.id}`);
    } catch (err) {
      this.logger.error(`Confirmation email failed for order ${order.id}: ${(err as Error).message}`);
    }
  }
}