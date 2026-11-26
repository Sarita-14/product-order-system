"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { ProductList } from "@/components/product-list";
import { buildHref } from "@/lib/search-params";
import type { ProductsPage } from "@/lib/types";

interface InfiniteProductListProps {
  firstPage: ProductsPage;
  query: string;
}

export function InfiniteProductList({
  firstPage,
  query,
}: InfiniteProductListProps) {
  const [products, setProducts] = useState(firstPage.items);
  const [meta, setMeta] = useState(firstPage.meta);
  const [status, setStatus] = useState<"idle" | "loading" | "error">("idle");
  const sentinelRef = useRef<HTMLDivElement>(null);

  const nextPage = meta.page + 1;

  const loadMore = useCallback(async () => {
    setStatus("loading");
    try {
      const res = await fetch(buildHref("/api/products", { query, page: nextPage }));
      if (!res.ok) throw new Error(`Request failed: ${res.status}`);
      const data: ProductsPage = await res.json();

      setProducts((current) => {
        // a product added meanwhile shifts the pages, so skip repeated rows
        const known = new Set(current.map((product) => product.id));
        return [...current, ...data.items.filter(({ id }) => !known.has(id))];
      });
      setMeta(data.meta);
      setStatus("idle");
    } catch {
      setStatus("error");
    }
  }, [query, nextPage]);

  // Watch an invisible element below the list. It is watched again after every
  // load, so a tall screen keeps loading until the list is longer than it.
  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel || status !== "idle" || !meta.hasNextPage) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        observer.disconnect(); // one load per page
        void loadMore();
      },
      { rootMargin: "200px" }, // start a little before the end is visible
    );
    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [status, meta.hasNextPage, loadMore]);

  return (
    <>
      <p className="mb-3 text-sm text-zinc-500">
        Showing {products.length} of {meta.total} products
      </p>
      <ProductList products={products} />
      <div ref={sentinelRef} aria-hidden="true" />

      <div role="status" className="py-6 text-center text-sm text-zinc-500">
        {status === "loading" && "Loading more…"}
        {status === "idle" && !meta.hasNextPage && "You have reached the end."}
        {status === "error" && (
          <>
            Could not load more products.{" "}
            <button
              type="button"
              onClick={() => void loadMore()}
              className="cursor-pointer underline"
            >
              Try again
            </button>
          </>
        )}
      </div>
    </>
  );
}
