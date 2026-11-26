import { Suspense } from "react";
import { NoProducts, ProductListSkeleton } from "@/components/product-list";
import { SearchBox } from "@/components/search-box";
import { fetchProducts } from "@/lib/api";
import { parseQuery } from "@/lib/search-params";
import { InfiniteProductList } from "./infinite-product-list";

const LIMIT = 10;

// Scroll pagination: the server renders the first page, the browser asks for
// the next one when the user gets near the end of the list.
export default function InfiniteScrollPage({
  searchParams,
}: PageProps<"/products/infinite-scroll">) {
  return (
    <>
      <h1 className="mb-4 text-2xl font-bold">Products: infinite scroll</h1>
      <SearchBox placeholder="Search products…" />
      <Suspense fallback={<ProductListSkeleton count={LIMIT} />}>
        <Results searchParams={searchParams} />
      </Suspense>
    </>
  );
}

async function Results({
  searchParams,
}: Pick<PageProps<"/products/infinite-scroll">, "searchParams">) {
  const query = parseQuery((await searchParams).query);

  return (
    <Suspense key={query} fallback={<ProductListSkeleton count={LIMIT} />}>
      <FirstPage query={query} />
    </Suspense>
  );
}

async function FirstPage({ query }: { query: string }) {
  const firstPage = await fetchProducts({ query, limit: LIMIT });

  if (firstPage.meta.total === 0) return <NoProducts query={query} />;

  return <InfiniteProductList firstPage={firstPage} query={query} />;
}
