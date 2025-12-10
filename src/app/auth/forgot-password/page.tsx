"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useForgetPassword } from "@/hooks/useAuth";
import { forgotPasswordSchema } from "@/validations/auth";
import { ForgotPasswordForm } from "@/validations/auth";

export default function ForgotPassword() {
  const { mutate } = useForgetPassword();

  const {
    register,
    handleSubmit,
    reset, // ✅ added
    formState: { errors },
  } = useForm<ForgotPasswordForm>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  const onSubmit = (data: ForgotPasswordForm) => {
    mutate(data.email, {
      onSuccess: () => {
        reset(); // ✅ clear input after successful submit
      },
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="w-full">
      <h2 className="text-lg lg:text-xl font-bold text-center mb-6">
        Forgot Password
      </h2>

      <Input
        type="email"
        label="Enter your Email"
        placeholder="Enter Your Email"
        error={errors.email?.message}
        {...register("email")}
        className="rounded-md mt-2 mb-4 bg-gray-100"
      />

      <Button
        type="submit"
        className="w-full bg-yellow-400 text-black font-semibold mb-6"
      >
        Send Reset Link
      </Button>

      <p className="text-center text-sm">
        Remembered your password?{" "}
        <Link href="/auth/login" className="text-yellow-400 font-semibold">
          Log In
        </Link>
      </p>
    </form>
  );
}
