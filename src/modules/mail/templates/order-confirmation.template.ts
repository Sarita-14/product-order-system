import { Order } from '../../orders/entities/order.entity';

const escape = (text: string) =>
  text.replace(/[&<>"']/g, (c) => `&#${c.charCodeAt(0)};`);

const money = (value: number) => value.toFixed(2);

const cell = 'padding:8px;border:1px solid #ddd';

/** Pure function: Order in, email subject + HTML out. Easy to unit-test. */
export function orderConfirmationTemplate(order: Order) {
  const rows = order.items
    .map(
      (item) => `
      <tr>
        <td style="${cell}">${escape(item.product.name)}</td>
        <td style="${cell};text-align:center">${item.quantity}</td>
        <td style="${cell};text-align:right">${money(item.unitPrice)}</td>
        <td style="${cell};text-align:right">${money(item.subtotal)}</td>
      </tr>`,
    )
    .join('');

  return {
    subject: `Order confirmed - #${order.id}`,
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
