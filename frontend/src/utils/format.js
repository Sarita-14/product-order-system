// Shared display + filter helpers (pure functions, no React).

// ---------- Constants ----------
export const LOW_STOCK_THRESHOLD = 10; // stock below this is shown as "Low"

// ---------- Formatting ----------
const inr = new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR" });

export const formatCurrency = (value) => inr.format(Number(value) || 0);

export const formatDate = (value) =>
  new Date(value).toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" });

// UUIDs are long; the first block is enough to recognise an order
export const shortId = (id) => `#${id.slice(0, 8)}`;

// ---------- Searching ----------
// Keeps rows where any of the given fields contains the query (case-insensitive)
export function filterBySearch(rows, query, fields) {
  const q = query.trim().toLowerCase();
  if (!q) return rows;
  return rows.filter((row) => fields.some((f) => String(row[f] ?? "").toLowerCase().includes(q)));
}
