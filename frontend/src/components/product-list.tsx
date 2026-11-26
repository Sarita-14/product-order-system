import type { Product } from "@/lib/types";

export function ProductList({ products }: { products: Product[] }) {
  return (
    <ul className="grid gap-3 sm:grid-cols-2">
      {products.map((product) => (
        <li
          key={product.id}
          className="rounded-lg border border-zinc-200 p-4 dark:border-zinc-800"
        >
          <div className="flex items-baseline justify-between gap-3">
            <h2 className="font-semibold">{product.name}</h2>
            <span className="tabular-nums">{product.price.toFixed(2)}</span>
          </div>
          {product.description && (
            <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
              {product.description}
            </p>
          )}
          <p className="mt-2 text-xs text-zinc-500">
            {product.stockQuantity > 0
              ? `${product.stockQuantity} in stock`
              : "Out of stock"}
          </p>
        </li>
      ))}
    </ul>
  );
}

export function NoProducts({ query }: { query?: string }) {
  return (
    <p className="py-12 text-center text-zinc-500">
      {query ? `No products match “${query}”.` : "No products yet."}
    </p>
  );
}

export function ProductListSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div role="status" className="grid gap-3 sm:grid-cols-2">
      <span className="sr-only">Loading…</span>
      {Array.from({ length: count }, (_, i) => (
        <div
          key={i}
          className="h-28 animate-pulse rounded-lg bg-zinc-100 dark:bg-zinc-900"
        />
      ))}
    </div>
  );
}
