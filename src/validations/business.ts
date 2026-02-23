// src/validations/business.ts
import { z } from "zod";

export const businessDetailsSchema = z.object({
  first_name: z.string().min(1, "First name is required"),
  last_name: z.string().min(1, "Last name is required"),
  phone: z.string().min(10, "Invalid phone number"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  address: z.string().min(1, "Address is required"),

  // 👇 Make them simple numbers (no coerce)
  latitude: z.number(),
  longitude: z.number(),
});

export type BusinessDetailsValues = z.infer<typeof businessDetailsSchema>;