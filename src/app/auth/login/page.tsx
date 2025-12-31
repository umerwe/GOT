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
import Image from "next/image"
import { Eye, EyeOff } from "lucide-react"


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
    <div className="w-full max-w-[450px] mx-auto bg-white p-[24px]">
      {/* Header Section */}
      <div className="mb-[24px]">
        <h5 className="text-[22px] text-[#000000] h-[35px]">User Login</h5>
        <p className="text-[#000000] text-[14px]">
          Welcome back. Enter your credentials to access your account
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
            className={`rounded-none ${errors.email ? 'border-red-500' : ''}`}
          />
          {errors.email && (
            <p
              style={{ fontFamily: "Manrope, sans-serif" }}
              className="text-red-600 text-[14px] mt-[4px] font-light">{errors.email.message}</p>
          )}
        </div>

        {/* Password Field */}
        <div className="space-y-[4px]">
          <div className="flex justify-between items-center">
            <label className="block text-sm font-normal text-[#0E1620]">Password</label>
            <Link
              href="/auth/forgot-password"
              className="text-xs font-bold text-[#000000]"
              style={{ fontFamily: "Manrope, sans-serif" }}
            >
              Forgot Password
            </Link>
          </div>
          <div className="relative">
            <Input
              type={showPassword ? "text" : "password"}
              placeholder="•••••••••••••"
              {...register("password")}
              className={`rounded-none ${errors.password ? 'border-red-500' : ''}`}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
          {errors.password && (
            <p
              style={{ fontFamily: "Manrope, sans-serif" }}
              className="text-red-600 text-[14px] mt-[4px] font-light">Please enter correct password</p>
          )}
        </div>

        {/* Keep me signed in */}
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="remember"
            className="w-4 h-4 rounded border-gray-300 text-black focus:ring-black cursor-pointer accent-black"
          />
          <label htmlFor="remember" className="text-sm text-gray-600 cursor-pointer select-none">
            Keep me signed in
          </label>
        </div>

        {/* Continue Button */}
        <Button
          type="submit"
          disabled={isPending}
          className="w-full bg-black hover:bg-gray-800 text-white font-medium h-11 sm:h-12 rounded-none transition-all text-base"
        >
          {isPending ? "Logging in..." : "Continue"}
        </Button>

        {/* Divider */}
        <div>
          <div className="relative flex items-center justify-center h-[32px] mb-[8px]">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-[#000000]"></span>
            </div>
            <div className="relative bg-white px-4">
              <span className="text-[#000000] text-sm">or sign in with</span>
            </div>
          </div>

          {/* Google Button */}
          {configData?.google_login && (
            <div className="grid grid-cols-1">
              <Button
                type="button"
                variant="outline"
                onClick={() => signIn("google")}
                className="w-full text-[12px] flex items-center justify-center gap-2 h-[36px]
             border border-[#D0D5DD] bg-white text-black hover:bg-gray-50
             rounded-none font-normal"
              >
                <Image
                  src="/google-logo.png"
                  alt="Google"
                  width={16}
                  height={16}
                />
                Google
              </Button>
            </div>
          )}


          {/* Footer Link */}
          <div className="text-[#000000] text-center mt-[32px]">
            <p className="text-sm">
              Don&apos;t have an Account? {" "}
              <Link href="/auth/signup" className="text-[#000000] text-sm font-normal underline hover:no-underline">
                Sign up here
              </Link>
            </p>
          </div>
        </div>
      </form>
    </div>
  )
}