// ─────────────────────────────────────────────────────────────────────────────
// FILE: services/product.service.ts — all product API calls live here.
// Pages call these functions and never write URLs or Axios code themselves.
// ─────────────────────────────────────────────────────────────────────────────

// Our HTTP helper.
import { http } from '@/lib/axios';
// The shapes we receive / send.
import type { Product, ProductInput } from '@/types/product';

// Public (no login needed)
// GET /products -> list of active products
export const getProducts = () => http.get<Product[]>('/products');
// GET /products/<id> -> one product (ApiError 404 if it doesn't exist)
export const getProductById = (id: string) => http.get<Product>(`/products/${id}`);

// Admin only (the backend answers 403 for anyone else)
// POST /products -> the new product
export const createProduct = (input: ProductInput) => http.post<Product>('/products', input);
// PATCH /products/<id> -> the updated product
export const updateProduct = (id: string, input: ProductInput) =>
  http.patch<Product>(`/products/${id}`, input);
// DELETE /products/<id> -> nothing (the product is hidden, not erased)
export const deleteProduct = (id: string) => http.delete(`/products/${id}`); // soft delete = the product is hidden, not erased
