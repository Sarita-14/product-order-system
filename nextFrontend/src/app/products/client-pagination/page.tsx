import { connection } from "next/server";
import { Suspense } from "react";
import { NoProducts, ProductListSkeleton } from "@/components/product-list";
import { fetchProducts } from "@/lib/api";
import { ClientPaginatedList } from "./client-paginated-list";

const PER_PAGE = 6;
const MAX_ITEMS = 100; // the most the API returns at once

// Task 3: one request, then pages are cut from memory with useState.
// Good for small lists; for big ones use /products/pagination.
export default function ClientPaginationPage() {
  return (
    <>
      <h1 className="mb-4 text-2xl font-bold">Products: client pages</h1>
      <Suspense fallback={<ProductListSkeleton count={PER_PAGE} />}>
        <Products />
      </Suspense>
    </>
  );
}

async function Products() {
  await connection(); // load at request time, not during `next build`
  const { items, meta } = await fetchProducts({ limit: MAX_ITEMS });

  if (items.length === 0) return <NoProducts />;

  return (
    <>
      {meta.total > items.length && (
        <p className="mb-3 text-sm text-zinc-500">
          Showing the newest {items.length} of {meta.total} products.
        </p>
      )}
      <ClientPaginatedList products={items} perPage={PER_PAGE} />
    </>
  );
}
