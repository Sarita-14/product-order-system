
import { z } from "zod";

//we will be applying login validation
//we have zod
//Creates a validation schema for an object
//defines validation rules : zod
export const loginschema = z.object({
    email: z
        .string()
        .email("please enter valid email"),
    // Email must be a string.
    // Email must follow a valid email format.
    // If not, show the given error message

    password: z
        .string()
        .min(6, "password must contain atleast 6 character"),
});

//registration validation
// CHANGED: fixed the "ENter Your Email" typo and added confirmPassword,
// so a mistyped password is caught before the account is created.
export const registerSchema = z
    .object({
        name: z
            .string()
            .min(2, "Name must contain atleast 2 characters"),

        email: z
            .string()
            .email("Enter a valid email"),

        password: z
            .string()
            .min(6, "password must be atleast 6 character"),

        confirmPassword: z.string(),
    })
    // Runs after the field rules; the error is shown under "confirmPassword"
    .refine((data) => data.password === data.confirmPassword, {
        message: "Passwords do not match",
        path: ["confirmPassword"],
    });
