import { Suspense } from "react";
import { PaginatedProducts } from "@/components/paginated-products";
import { ProductListSkeleton } from "@/components/product-list";
import { parsePage } from "@/lib/search-params";

const LIMIT = 5;

// Task 2: server-side pagination with ?page=
export default function ProductsPage({ searchParams }: PageProps<"/products">) {
  return (
    <>
      <h1 className="mb-4 text-2xl font-bold">Products: server pages</h1>
      <Suspense fallback={<ProductListSkeleton count={LIMIT} />}>
        <Results searchParams={searchParams} />
      </Suspense>
    </>
  );
}

async function Results({
  searchParams,
}: Pick<PageProps<"/products">, "searchParams">) {
  const page = parsePage((await searchParams).page);

  // a new key shows the skeleton again for every page
  return (
    <Suspense key={page} fallback={<ProductListSkeleton count={LIMIT} />}>
      <PaginatedProducts path="/products" page={page} limit={LIMIT} />
    </Suspense>
  );
}
