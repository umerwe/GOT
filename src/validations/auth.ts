import { z } from "zod";

export const SignUpSchema = z.object({
  name: z.string(),
  email: z.string().email("Invalid email"),
  phone: z.string(),
  password: z.string().min(6, "Password must be at least 6 characters"),
  confirmPassword: z.string(),
  terms: z.literal(true, {
    message: "You must accept the terms & conditions",
  }),
});

export const LoginSchema = z.object({
  email: z.string().min(1, "Email is required").email("Invalid email"),
  password: z.string().min(1, "Password is required"),
});

export const forgotPasswordSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
});


export type SignUp = z.infer<typeof SignUpSchema>;
export type Login = z.infer<typeof LoginSchema>;
export type ForgotPasswordForm = z.infer<typeof forgotPasswordSchema>;
