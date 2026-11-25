// Order details page (/orders/:id): summary + line items of one order.
import { useCallback } from "react";
import { Link, useParams } from "react-router-dom";
import useApi from "../hooks/useApi";
import { ordersApi } from "../api/resources";
import { formatCurrency, formatDate, shortId } from "../utils/format";
import AsyncState from "../components/ui/AsyncState";
import DataTable from "../components/ui/DataTable";
import PageHeader from "../components/ui/PageHeader";
import StatCard from "../components/ui/StatCard";
import { OrderStatusBadge } from "../components/ui/Badge";

// ---------- Line-item columns ----------
// unitPrice is the price snapshot taken when the order was placed
const ITEM_COLUMNS = [
  { key: "product", header: "Product", render: (i) => i.product?.name ?? "Deleted product" },
  { key: "unitPrice", header: "Unit price", className: "num", render: (i) => formatCurrency(i.unitPrice) },
  { key: "quantity", header: "Qty", className: "num" },
  { key: "subtotal", header: "Subtotal", className: "num", render: (i) => formatCurrency(i.subtotal) },
];

function OrderDetails() {
  const { id } = useParams();

  // useCallback keeps the loader stable until the id changes (see useApi)
  const loadOrder = useCallback(() => ordersApi.get(id), [id]);
  const query = useApi(loadOrder);
  const order = query.data;

  return (
    <>
      <Link to="/orders" className="back-link">← Back to orders</Link>

      <AsyncState {...query}>
        {order && (
          <>
            <PageHeader title={`Order ${shortId(order.id)}`} subtitle={`Placed on ${formatDate(order.createdAt)}`}>
              <OrderStatusBadge status={order.status} />
            </PageHeader>

            <section className="stats-grid">
              <StatCard label="Customer" value={order.customerName} hint={order.customerEmail} />
              <StatCard label="Items" value={order.items.length} />
              <StatCard label="Total" value={formatCurrency(order.totalAmount)} />
            </section>

            <div className="card">
              <h2>Items</h2>
              <DataTable columns={ITEM_COLUMNS} rows={order.items} />
            </div>
          </>
        )}
      </AsyncState>
    </>
  );
}

export default OrderDetails;
