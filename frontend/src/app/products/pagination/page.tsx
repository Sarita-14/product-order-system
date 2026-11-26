import { Suspense } from "react";
import { PaginatedProducts } from "@/components/paginated-products";
import { ProductListSkeleton } from "@/components/product-list";
import { SearchBox } from "@/components/search-box";
import { parsePage, parseQuery } from "@/lib/search-params";

const LIMIT = 10;

// Tasks 4 and 5: ?query= and ?page= together. The database does the filtering,
// so only the 10 products on screen are ever loaded.
export default function PaginationPage({
  searchParams,
}: PageProps<"/products/pagination">) {
  return (
    <>
      <h1 className="mb-4 text-2xl font-bold">Products: search + pages</h1>
      <SearchBox placeholder="Search products…" />
      <Suspense fallback={<ProductListSkeleton count={LIMIT} />}>
        <Results searchParams={searchParams} />
      </Suspense>
    </>
  );
}

async function Results({
  searchParams,
}: Pick<PageProps<"/products/pagination">, "searchParams">) {
  const params = await searchParams;
  const query = parseQuery(params.query);
  const page = parsePage(params.page);

  return (
    <Suspense
      key={`${query}|${page}`}
      fallback={<ProductListSkeleton count={LIMIT} />}
    >
      <PaginatedProducts
        path="/products/pagination"
        query={query}
        page={page}
        limit={LIMIT}
      />
    </Suspense>
  );
}
