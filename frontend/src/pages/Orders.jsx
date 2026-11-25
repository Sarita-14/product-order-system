// Orders page: all orders (newest first) with search and a status filter.
import { useState } from "react";
import { Link } from "react-router-dom";
import useApi from "../hooks/useApi";
import { ordersApi } from "../api/resources";
import { filterBySearch } from "../utils/format";
import AsyncState from "../components/ui/AsyncState";
import PageHeader from "../components/ui/PageHeader";
import OrdersTable from "../components/OrdersTable";

// Same values as the backend OrderStatus enum ("" = all)
const STATUSES = ["", "CONFIRMED", "PENDING", "CANCELLED", "FAILED"];

function Orders() {
  // ---------- State ----------
  const query = useApi(ordersApi.list);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");

  // ---------- Filtering ----------
  const visibleOrders = (orders) =>
    filterBySearch(orders, search, ["id", "customerName", "customerEmail"]).filter(
      (o) => !status || o.status === status,
    );

  // ---------- Markup ----------
  return (
    <>
      <PageHeader title="Orders" subtitle="Click an order to see its items.">
        <Link to="/orders/new" className="btn btn-primary">+ New order</Link>
      </PageHeader>

      <div className="card">
        <div className="toolbar">
          <input
            type="search"
            className="search"
            placeholder="Search by order id, customer name or email…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <select value={status} onChange={(e) => setStatus(e.target.value)} aria-label="Filter by status">
            {STATUSES.map((s) => (
              <option key={s} value={s}>
                {s || "All statuses"}
              </option>
            ))}
          </select>
        </div>

        <AsyncState {...query}>
          {query.data && <OrdersTable orders={visibleOrders(query.data)} emptyText="No orders found." />}
        </AsyncState>
      </div>
    </>
  );
}

export default Orders;
