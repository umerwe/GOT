"use client"

import { useState } from "react"
import Link from "next/link"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { FaEye, FaEyeSlash } from "react-icons/fa"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { type Login, LoginSchema } from "@/validations/auth"
import { useLogin } from "@/hooks/useAuth"
import { signIn } from "next-auth/react"
import { useAppSelector } from "@/store/hooks"
import { FcGoogle } from "react-icons/fc"

export default function LoginForm() {
  const configData = useAppSelector((state) => state.config.data)
  const [showPassword, setShowPassword] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Login>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  })

  const { mutate, isPending } = useLogin()

  const onSubmit = (data: Login) => {
    mutate(data)
  }

  return (
    <div className="w-full max-w-[450px] mx-auto bg-white p-4 sm:p-8 border">
      {/* Header Section */}
      <div className="mb-8">
        <h2 className="text-xl font-bold text-gray-900">User Login</h2>
        <p className="text-gray-600 text-sm">
          Welcome back. Enter your credentials to access your account
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        {/* Email Field */}
        <div className="space-y-1.5">
          <label className="block text-sm font-medium text-gray-700">Email Address</label>
          <Input
            type="email"
            placeholder="twinum@example.com"
            {...register("email")}
            className="rounded-none"
          />
          {errors.email && (
            <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>
          )}
        </div>

        {/* Password Field */}
        <div className="space-y-1.5">
          <div className="flex justify-between items-center">
            <label className="block text-sm font-medium text-gray-700">Password</label>
            <Link
              href="/auth/forgot-password"
              className="text-xs font-medium text-gray-900 hover:underline"
            >
              Forgot Password
            </Link>
          </div>
          <div className="relative">
            <Input
              type={showPassword ? "text" : "password"}
              placeholder="•••••••••••••"
              {...register("password")}
              className="rounded-none"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              {showPassword ? <FaEyeSlash size={18} /> : <FaEye size={18} />}
            </button>
          </div>
          {errors.password && (
            <p className="text-red-500 text-xs mt-1">Please enter correct password</p>
          )}
        </div>

        {/* Keep me signed in */}
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="remember"
            className="w-4 h-4  rounded border-gray-300 text-black focus:ring-black cursor-pointer accent-black"
          />
          <label htmlFor="remember" className="text-sm text-gray-600 cursor-pointer select-none">
            Keep me signed in
          </label>
        </div>

        {/* Continue Button */}
        <Button
          type="submit"
          disabled={isPending}
          className="w-full bg-black hover:bg-gray-800 text-white font-medium h-11 sm:h-12 rounded-md transition-all text-base"
        >
          {isPending ? "Logging in..." : "Continue"}
        </Button>

        {/* Divider */}
        <div className="relative flex items-center justify-center mb-6">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-gray-300"></span>
          </div>
          <div className="relative bg-white px-4">
            <span className="text-gray-500 text-sm">or sign up with</span>
          </div>
        </div>

        {/* Google Button */}
        {configData?.google_login && (
          <div className="grid grid-cols-1">
            <Button
              type="button"
              variant="outline"
              onClick={() => signIn("google")}
              className="w-full flex items-center justify-center gap-2 h-11 sm:h-12 border border-gray-200 bg-white text-gray-700 hover:bg-gray-50 rounded-md font-medium"
            >
              <FcGoogle size={20} />
              Google
            </Button>
          </div>
        )}

        {/* Footer Link */}
        <div className="text-center mt-6">
          <p className="text-sm text-gray-600">
            Don't have an Account? &apos;
            <Link href="/auth/signup" className="text-gray-900 font-bold underline hover:no-underline">
              Sign up here
            </Link>
          </p>
        </div>
      </form>
    </div>
  )
}