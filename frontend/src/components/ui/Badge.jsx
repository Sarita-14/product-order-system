// Small coloured label + the two badges the app needs (order status, stock level).
import { LOW_STOCK_THRESHOLD } from "../../utils/format";

// ---------- Generic badge ----------
// tone: "success" | "warning" | "danger" | "muted"
function Badge({ tone = "muted", children }) {
  return <span className={`badge badge-${tone}`}>{children}</span>;
}

// ---------- Order status (backend OrderStatus enum) ----------
const STATUS_TONE = {
  CONFIRMED: "success",
  PENDING: "warning",
  CANCELLED: "muted",
  FAILED: "danger",
};

export function OrderStatusBadge({ status }) {
  return <Badge tone={STATUS_TONE[status]}>{status}</Badge>;
}

// ---------- Stock level ----------
export function StockBadge({ quantity }) {
  if (quantity === 0) return <Badge tone="danger">Out of stock</Badge>;
  if (quantity < LOW_STOCK_THRESHOLD) return <Badge tone="warning">Low · {quantity}</Badge>;
  return <Badge tone="success">{quantity} in stock</Badge>;
}

export default Badge;
