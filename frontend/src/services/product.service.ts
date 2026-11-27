import { cacheLife } from 'next/cache';
import { http, publicHttp } from '@/lib/axios';
import type { Product, ProductInput } from '@/types/product';
export const getProducts = () => publicHttp.get<Product[]>('/products');

export const getProductById = (id: string) => publicHttp.get<Product>(`/products/${id}`);
export async function getCachedProduct(id: string): Promise<Product> {
  'use cache';
  cacheLife('days');
  return getProductById(id);
}
export const createProduct = (input: ProductInput) => http.post<Product>('/products', input);
export const updateProduct = (id: string, input: ProductInput) =>
  http.patch<Product>(`/products/${id}`, input);
export const deleteProduct = (id: string) => http.delete(`/products/${id}`); // soft delete = the product is hidden, not erased
