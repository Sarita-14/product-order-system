"use client";

import { useState } from "react";
import { Pagination } from "@/components/pagination";
import { ProductList } from "@/components/product-list";
import type { Product } from "@/lib/types";

interface ClientPaginatedListProps {
  products: Product[];
  perPage: number;
}

export function ClientPaginatedList({
  products,
  perPage,
}: ClientPaginatedListProps) {
  const [selectedPage, setSelectedPage] = useState(1);

  const totalPages = Math.ceil(products.length / perPage);
  // the list can get shorter after a refresh
  const page = Math.min(selectedPage, totalPages);
  const start = (page - 1) * perPage;

  return (
    <>
      <ProductList products={products.slice(start, start + perPage)} />
      <Pagination
        page={page}
        totalPages={totalPages}
        onPageChange={setSelectedPage}
      />
    </>
  );
}
