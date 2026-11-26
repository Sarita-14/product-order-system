// ─────────────────────────────────────────────────────────────────────────────
// FILE: components/products/stock-badge.tsx
// Green "12 in stock" or red "Out of stock" pill (used on 4 screens, written once).
// ─────────────────────────────────────────────────────────────────────────────

// stock = how many are left (prop).
export function StockBadge({ stock }: { stock: number }) {
  // true when at least one is left.
  const inStock = stock > 0;
  return (
    <span
      // "a ? b : c" = if a then b else c -> green or red colours.
      className={`w-fit rounded-full px-3 py-1 text-xs font-medium ${
        inStock ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
      }`}
    >
      {inStock ? `${stock} in stock` : 'Out of stock'}
    </span>
  );
}
