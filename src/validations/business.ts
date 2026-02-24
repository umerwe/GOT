// src/validations/business.ts
import { z } from "zod";

export const businessDetailsSchema = z.object({
  first_name: z.string().min(1, "First name is required"),
  last_name: z.string().min(1, "Last name is required"),
  phone: z.string().min(10, "Invalid phone number"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  address: z.string().min(1, "Address is required"),
  latitude: z.number(),
  longitude: z.number(),
});

export const businessProfileSchema = z.object({
  first_name: z.string(),
  last_name: z.string(),
  phone: z.string(),
  address: z.string()
});

export type BusinessDetailsValues = z.infer<typeof businessDetailsSchema>;
export type BusinessProfileValues = z.infer<typeof businessProfileSchema>;