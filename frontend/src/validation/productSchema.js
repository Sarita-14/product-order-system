// Product form validation. Mirrors the backend CreateProductDto rules
// (name ≤ 255, price > 0 with ≤ 2 decimals, stock integer ≥ 0).
// z.coerce turns the <input> text into numbers.
import { z } from "zod";

export const productSchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(255, "Max 255 characters"),

  description: z.string().trim().optional(),

  price: z.coerce
    .number()
    .positive("Price must be greater than 0")
    .refine((v) => /^\d+(\.\d{1,2})?$/.test(String(v)), "Use at most 2 decimal places"),

  stockQuantity: z.coerce
    .number()
    .int("Stock must be a whole number")
    .min(0, "Stock cannot be negative"),
});
