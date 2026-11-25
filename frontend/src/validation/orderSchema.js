// Place-order form validation. Mirrors the backend CreateOrderDto:
// a customer, at least one item, quantity ≥ 1, and each product only once.
// (Stock availability is checked by the backend.)
import { z } from "zod";

const orderItemSchema = z.object({
  productId: z.string().min(1, "Select a product"),
  quantity: z.coerce.number().int("Whole numbers only").min(1, "At least 1"),
});

export const orderSchema = z.object({
  userId: z.string().min(1, "Select a customer"),

  items: z
    .array(orderItemSchema)
    .min(1, "Add at least one product")
    .refine(
      (items) => new Set(items.map((i) => i.productId)).size === items.length,
      "Each product can appear only once; combine quantities instead",
    ),
});
