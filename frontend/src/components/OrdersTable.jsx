// Orders table, shared by the Orders page and the Dashboard's "Recent orders".
// Clicking a row opens the order details page.
import { useNavigate } from "react-router-dom";
import DataTable from "./ui/DataTable";
import { OrderStatusBadge } from "./ui/Badge";
import { formatCurrency, formatDate, shortId } from "../utils/format";

// ---------- Column config (defined once, outside the component) ----------
const COLUMNS = [
  { key: "id", header: "Order", render: (o) => <code>{shortId(o.id)}</code> },
  {
    key: "customer",
    header: "Customer",
    render: (o) => (
      <>
        <strong>{o.customerName}</strong>
        <div className="muted small">{o.customerEmail}</div>
      </>
    ),
  },
  { key: "items", header: "Items", className: "num", render: (o) => o.items?.length ?? 0 },
  { key: "totalAmount", header: "Total", className: "num", render: (o) => formatCurrency(o.totalAmount) },
  { key: "status", header: "Status", render: (o) => <OrderStatusBadge status={o.status} /> },
  { key: "createdAt", header: "Placed on", render: (o) => formatDate(o.createdAt) },
];

function OrdersTable({ orders, emptyText = "No orders yet." }) {
  const navigate = useNavigate();
  return (
    <DataTable
      columns={COLUMNS}
      rows={orders}
      emptyText={emptyText}
      onRowClick={(order) => navigate(`/orders/${order.id}`)}
    />
  );
}

export default OrdersTable;
