// ─────────────────────────────────────────────────────────────────────────────
// FILE: order-confirmation.template.ts — builds the email sent after an order.
// Pure function: Order in, email subject + HTML out. Easy to unit-test.
//
// DATA COMES FROM: PlaceOrderUseCase passes the freshly saved order
//   (with its items and each item's product) through MailService.
// ─────────────────────────────────────────────────────────────────────────────

// The Order entity (only used as a type here).
import { Order } from '../../orders/entities/order.entity';

// escape: makes text safe to put inside HTML. It replaces & < > " ' with codes
// like "&#60;", so a product named "<script>" shows as text instead of running.
const escape = (text: string) =>
  text.replace(/[&<>"']/g, (c) => `&#${c.charCodeAt(0)};`);

// money: 499.5 -> "499.50" (always 2 decimals).
const money = (value: number) => value.toFixed(2);

// The style of one table cell, written once and reused for every cell.
const cell = 'padding:8px;border:1px solid #ddd';

/** Pure function: Order in, email subject + HTML out. Easy to unit-test. */
export function orderConfirmationTemplate(order: Order) {
  // Build one HTML table row (<tr>) per item, then join them into one text.
  const rows = order.items
    // .map = for each item, make a row of text
    .map(
      (item) => `
      <tr>
        <td style="${cell}">${escape(item.product.name)}</td>
        <td style="${cell};text-align:center">${item.quantity}</td>
        <td style="${cell};text-align:right">${money(item.unitPrice)}</td>
        <td style="${cell};text-align:right">${money(item.subtotal)}</td>
      </tr>`,
    )
    // .join('') = glue all rows together with nothing in between
    .join('');

  // Return the two things an email needs.
  return {
    // The subject line. "Received", because a new order is PENDING until it is paid.
    subject: `Order received - #${order.id}`,
    // The body as HTML. ${...} inserts values into the text (a "template literal").
    html: `
    <div style="font-family:Arial,sans-serif;max-width:600px;margin:auto;color:#333">
      <h2>Thank you for your order, ${escape(order.customerName)}!</h2>
      <p><strong>Order ID:</strong> ${order.id}<br/>
         <strong>Status:</strong> ${order.status}</p>
      <table style="width:100%;border-collapse:collapse">
        <thead><tr>
          <th style="${cell};text-align:left">Product</th>
          <th style="${cell}">Qty</th>
          <th style="${cell};text-align:right">Unit price</th>
          <th style="${cell};text-align:right">Subtotal</th>
        </tr></thead>
        <tbody>${rows}</tbody>
        <tfoot><tr>
          <td colspan="3" style="${cell};text-align:right"><strong>Total</strong></td>
          <td style="${cell};text-align:right"><strong>${money(order.totalAmount)}</strong></td>
        </tr></tfoot>
      </table>
    </div>`,
  };
}
