import { Injectable, Logger } from '@nestjs/common';
import { Resend } from 'resend';

@Injectable()
export class MailService {
  private readonly logger = new Logger(MailService.name);
  private resend: Resend;
  private readonly emailFrom: string;

  constructor() {
    this.resend = new Resend(process.env.RESEND_API_KEY);
    this.emailFrom = process.env.EMAIL_FROM || 'onboarding@resend.dev';
  }

  async sendOrderConfirmation(
    to: string,
    customerName: string,
    orderId: string,
    totalAmount: number,
    items: Array<{ name: string; quantity: number; unitPrice: number; subtotal: number }>,
  ): Promise<void> {
    try {
      const itemsHtml = items
        .map(
          (item) =>
            `<tr>
              <td style="padding: 8px; border: 1px solid #ddd;">${item.name}</td>
              <td style="padding: 8px; border: 1px solid #ddd; text-align: center;">${item.quantity}</td>
              <td style="padding: 8px; border: 1px solid #ddd; text-align: right;">$${Number(item.unitPrice).toFixed(2)}</td>
              <td style="padding: 8px; border: 1px solid #ddd; text-align: right;">$${Number(item.subtotal).toFixed(2)}</td>
            </tr>`,
        )
        .join('');

      await this.resend.emails.send({
        from: this.emailFrom,
        to,
        subject: `Order Confirmation #${orderId}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #333;">
            <h2 style="color: #2c3e50;">Order Confirmation</h2>
            <p>Hi <strong>${customerName}</strong>,</p>
            <p>Thank you for your order! Your order has been placed successfully.</p>
            <p><strong>Order ID:</strong> ${orderId}</p>
            
            <table style="width: 100%; border-collapse: collapse; margin-top: 20px;">
              <thead>
                <tr style="background-color: #f8f9fa;">
                  <th style="padding: 8px; border: 1px solid #ddd; text-align: left;">Product</th>
                  <th style="padding: 8px; border: 1px solid #ddd; text-align: center;">Qty</th>
                  <th style="padding: 8px; border: 1px solid #ddd; text-align: right;">Unit Price</th>
                  <th style="padding: 8px; border: 1px solid #ddd; text-align: right;">Subtotal</th>
                </tr>
              </thead>
              <tbody>
                ${itemsHtml}
              </tbody>
              <tfoot>
                <tr>
                  <td colspan="3" style="padding: 10px; text-align: right; font-weight: bold; border: 1px solid #ddd;">Total:</td>
                  <td style="padding: 10px; text-align: right; font-weight: bold; border: 1px solid #ddd;">$${Number(totalAmount).toFixed(2)}</td>
                </tr>
              </tfoot>
            </table>
            
            <p style="margin-top: 30px; font-size: 12px; color: #777;">If you have any questions, reply to this email.</p>
          </div>
        `,
      });

      this.logger.log(`Order confirmation email sent to ${to} for Order #${orderId}`);
    } catch (error) {
      this.logger.error(`Failed to send email to ${to}:`, error);
    }
  }
}