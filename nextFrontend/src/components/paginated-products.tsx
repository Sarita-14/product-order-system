import { redirect } from "next/navigation";
import { fetchProducts } from "@/lib/api";
import { buildHref } from "@/lib/search-params";
import { Pagination } from "./pagination";
import { NoProducts, ProductList } from "./product-list";

interface PaginatedProductsProps {
  path: string;
  page: number;
  query?: string;
  limit: number;
}

/** Server component: loads exactly one page and draws its links. */
export async function PaginatedProducts({
  path,
  page,
  query,
  limit,
}: PaginatedProductsProps) {
  const { items, meta } = await fetchProducts({ query, page, limit });

  if (meta.total === 0) return <NoProducts query={query} />;

  // ?page=999 of 10: go to the last real page
  if (page > meta.totalPages) {
    redirect(buildHref(path, { query, page: meta.totalPages }));
  }

  return (
    <>
      <p className="mb-3 text-sm text-zinc-500">
        Page {meta.page} of {meta.totalPages} · {meta.total} products
      </p>
      <ProductList products={items} />
      <Pagination
        page={meta.page}
        totalPages={meta.totalPages}
        hrefFor={(target) => buildHref(path, { query, page: target })}
      />
    </>
  );
}
