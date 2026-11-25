
// CHANGED (improvement): the old page only had a heading and a Logout button.
// Logout now lives in the Navbar (shown on every page); the Dashboard shows
// live numbers from the backend, recent orders and low-stock products.
import { Link } from "react-router-dom";
import useApi from "../hooks/useApi";
import { ordersApi, productsApi, usersApi } from "../api/resources";
import { authApi } from "../api/authApi";
import { formatCurrency, LOW_STOCK_THRESHOLD } from "../utils/format";
import AsyncState from "../components/ui/AsyncState";
import DataTable from "../components/ui/DataTable";
import PageHeader from "../components/ui/PageHeader";
import StatCard from "../components/ui/StatCard";
import { StockBadge } from "../components/ui/Badge";
import OrdersTable from "../components/OrdersTable";

// ---------- Data loading (module-level → stable reference for useApi) ----------
// The three lists are fetched in parallel.
const loadDashboard = async () => {
  const [products, orders, customers] = await Promise.all([
    productsApi.list(),
    ordersApi.list(),
    usersApi.list(),
  ]);
  return { products, orders, customers };
};

const LOW_STOCK_COLUMNS = [
  { key: "name", header: "Product" },
  { key: "stockQuantity", header: "Stock", render: (p) => <StockBadge quantity={p.stockQuantity} /> },
];

function Dashboard() {
  const user = authApi.getCurrentUser();
  const query = useApi(loadDashboard);

  return (
    <>
      <PageHeader title={`Welcome, ${user?.name ?? "there"}`} subtitle="Here's what's happening in your store.">
        <Link to="/products" className="btn btn-ghost">Manage products</Link>
        <Link to="/orders/new" className="btn btn-primary">+ New order</Link>
      </PageHeader>

      <AsyncState {...query}>{query.data && <DashboardContent {...query.data} />}</AsyncState>
    </>
  );
}

// ---------- Content (rendered once the data is loaded) ----------
function DashboardContent({ products, orders, customers }) {
  // Only confirmed orders count as revenue
  const revenue = orders
    .filter((o) => o.status === "CONFIRMED")
    .reduce((sum, o) => sum + o.totalAmount, 0);
  const lowStock = products.filter((p) => p.stockQuantity < LOW_STOCK_THRESHOLD);

  return (
    <>
      <section className="stats-grid">
        <StatCard label="Revenue" value={formatCurrency(revenue)} hint="From confirmed orders" />
        <StatCard label="Orders" value={orders.length} />
        <StatCard label="Products" value={products.length} hint={`${lowStock.length} low on stock`} />
        <StatCard label="Customers" value={customers.length} />
      </section>

      <section className="dashboard-grid">
        <div className="card">
          <div className="card-header">
            <h2>Recent orders</h2>
            <Link to="/orders">View all →</Link>
          </div>
          <OrdersTable orders={orders.slice(0, 5)} />
        </div>

        <div className="card">
          <div className="card-header">
            <h2>Low stock</h2>
            <Link to="/products">Restock →</Link>
          </div>
          <DataTable columns={LOW_STOCK_COLUMNS} rows={lowStock} emptyText="All products are well stocked" />
        </div>
      </section>
    </>
  );
}

export default Dashboard;
