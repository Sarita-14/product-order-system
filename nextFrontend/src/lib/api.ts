// Product requests. The HTTP details (URL, token, errors) live in server-api.ts.
// Only import this from server code (Server Components, Route Handlers).
import { apiFetch } from "./server-api";
import type { Product, ProductsPage } from "./types";

const DEFAULT_LIMIT = 10;

interface FetchProductsOptions {
  query?: string;
  page?: number;
  limit?: number;
}

/**
 * One page of products.
 * GET /products filters by ?search= but returns every match as a plain array,
 * so the page is cut out here.
 */
export async function fetchProducts({
  query,
  page = 1,
  limit = DEFAULT_LIMIT,
}: FetchProductsOptions = {}): Promise<ProductsPage> {
  const suffix = query ? `?${new URLSearchParams({ search: query })}` : "";
  const products = await apiFetch<Product[]>(`/products${suffix}`);

  const total = products.length;
  const totalPages = Math.ceil(total / limit);
  const start = (page - 1) * limit;

  return {
    items: products.slice(start, start + limit),
    meta: {
      page,
      limit,
      total,
      totalPages,
      hasNextPage: page < totalPages,
      hasPreviousPage: page > 1,
    },
  };
}
