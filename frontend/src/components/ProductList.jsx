// CHANGED: this file existed but was empty — it is now the products table
// (with Edit / Delete buttons) used by pages/Products.jsx.
import DataTable from "./ui/DataTable";
import { StockBadge } from "./ui/Badge";
import { formatCurrency, formatDate } from "../utils/format";

function ProductList({ products, onEdit, onDelete }) {
  // ---------- Column config for DataTable ----------
  const columns = [
    {
      key: "name",
      header: "Product",
      render: (p) => (
        <>
          <strong>{p.name}</strong>
          {p.description && <div className="muted small">{p.description}</div>}
        </>
      ),
    },
    { key: "price", header: "Price", className: "num", render: (p) => formatCurrency(p.price) },
    { key: "stockQuantity", header: "Stock", render: (p) => <StockBadge quantity={p.stockQuantity} /> },
    { key: "updatedAt", header: "Last updated", render: (p) => formatDate(p.updatedAt) },
    {
      key: "actions",
      header: "",
      className: "actions",
      render: (p) => (
        <>
          <button type="button" className="btn btn-ghost btn-sm" onClick={() => onEdit(p)}>
            Edit
          </button>
          <button type="button" className="btn btn-danger btn-sm" onClick={() => onDelete(p)}>
            Delete
          </button>
        </>
      ),
    },
  ];

  return <DataTable columns={columns} rows={products} emptyText="No products found." />;
}

export default ProductList;
