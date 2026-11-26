// ─────────────────────────────────────────────────────────────────────────────
// FILE: types/product.ts — what a product looks like in the frontend.
// DATA COMES FROM: GET /products and GET /products/:id (backend).
// ─────────────────────────────────────────────────────────────────────────────

// The shape of one product, exactly as the NestJS API sends it
// (matches the Product entity in the backend).
export interface Product {
  id: string; // unique id: a long random code like 4f1c2b8d-...
  name: string;
  description: string | null; // can be empty in the database
  price: number; // in rupees, e.g. 499
  stockQuantity: number; // how many are left
  isActive: boolean; // false = deleted product (the API only returns active ones)
  createdAt: string; // date as text, e.g. "2026-11-26T07:30:00.000Z"
  updatedAt: string; // last change, as text
}

// What the admin product form sends to POST/PATCH /products
// Pick = only these fields of Product; "& { description?: string }" = plus an optional description.
export type ProductInput = Pick<Product, 'name' | 'price' | 'stockQuantity'> & {
  description?: string;
};
