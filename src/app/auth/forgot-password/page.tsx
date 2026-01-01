"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { useForgetPassword } from "@/hooks/useAuth"
import { forgotPasswordSchema, type ForgotPasswordForm } from "@/validations/auth"

export default function ForgotPassword() {
  const { mutate, isPending } = useForgetPassword() // added isPending for button state

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ForgotPasswordForm>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  })

  const onSubmit = (data: ForgotPasswordForm) => {
    mutate(data.email, {
      onSuccess: () => {
        reset()
      },
    })
  }

  return (
    <div className="w-full max-w-[450px] mx-auto bg-white p-[24px]">
      {/* Header Section */}
      <div className="mb-[24px]">
        <h5 className="text-[22px] text-[#000000] h-[35px]">Forgot Password</h5>
        <p className="text-[#000000] text-[14px]">
          Enter your email address below and we&apos;ll send you a link to reset your password.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-[24px]">
        {/* Email Field */}
        <div className="space-y-[4px]">
          <label className="block text-sm font-normal text-[#0E1620]">Email Address</label>
          <Input
            type="email"
            placeholder="twinum@example.com"
            {...register("email")}
            className={`rounded-none ${errors.email ? "border-red-500" : ""}`}
          />
          {errors.email && (
            <p
              style={{ fontFamily: "Manrope, sans-serif" }}
              className="text-red-600 text-[14px] mt-[4px] font-light"
            >
              {errors.email.message}
            </p>
          )}
        </div>

        {/* Submit Button */}
        <Button
          type="submit"
          disabled={isPending}
          className="w-full bg-black hover:bg-gray-800 text-white font-medium h-11 sm:h-12 rounded-none transition-all text-base"
        >
          {isPending ? "Sending..." : "Send Reset Link"}
        </Button>

        {/* Footer Link */}
        <div className="text-[#000000] text-center mt-[32px]">
          <p className="text-sm">
            Remembered your password?{" "}
            <Link
              href="/auth/login"
              className="text-[#000000] text-sm font-normal underline hover:no-underline"
            >
              Log In here
            </Link>
          </p>
        </div>
      </form>
    </div>
  )
}