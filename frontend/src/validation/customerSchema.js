// Customer form validation. Mirrors the backend CreateUserDto
// (username ≤ 100, valid email ≤ 255, phone ≤ 20 characters).
import { z } from "zod";

export const customerSchema = z.object({
  username: z.string().trim().min(1, "Username is required").max(100, "Max 100 characters"),

  email: z.string().trim().email("Enter a valid email").max(255, "Max 255 characters"),

  phoneNumber: z
    .string()
    .trim()
    .regex(/^[0-9+\-\s]{7,20}$/, "Enter a valid phone number (7–20 digits)"),
});
