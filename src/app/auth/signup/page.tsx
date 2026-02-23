"use client";

import { useState } from "react";
import Link from "next/link";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SignUp, SignUpSchema } from "@/validations/auth";
import { useSignup } from "@/hooks/useAuth";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import { signIn } from "next-auth/react";
import { FcGoogle } from "react-icons/fc";
import { useAppSelector } from "@/store/hooks";
import Image from "next/image";
import { Eye, EyeClosed, EyeOff } from "lucide-react";
import { cn } from "@/lib/utils";

export default function SignUpForm() {
  const configData = useAppSelector((state) => state.config.data);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const { mutate, isPending } = useSignup();

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<SignUp>({
    resolver: zodResolver(SignUpSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = (data: SignUp) => {
    mutate(data);
  };

  return (
    <div className="w-full max-w-[450px] mx-auto bg-white p-[24px]">
      <div className="mb-[24px]">
        <h5 className="text-[22px] text-[#000000] h-[35px]">User Sign Up</h5>
        <p className="text-[#000000] text-[14px]">
          Create an account to get started
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-[24px]">
        {/* Full Name */}
        <div className="space-y-[4px]">
          <label className="block text-sm font-medium text-[#0E1620]">Full Name</label>
          <Input
            type="text"
            placeholder="Enter Your Name"
            {...register("name")}
            className={`rounded-none ${errors.name ? 'border-red-500' : ''}`}
          />
          {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
        </div>

        {/* Email */}
        <div className="space-y-[4px]">
          <label className="block text-sm font-medium text-[#0E1620]">Email Address</label>
          <Input
            type="email"
            placeholder="twinum@example.com"
            {...register("email")}
            className={`rounded-none ${errors.email ? 'border-red-500' : ''}`}
          />
          {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
        </div>

        {/* Phone */}
        <div className="space-y-[4px]">
          <label className="block text-sm font-medium text-[#0E1620]">Phone</label>
          <Controller
            name="phone"
            control={control}
            render={({ field }) => (
              <PhoneInput
                {...field}
                country="pk"
                enableSearch
                inputClass={cn(
                  "!w-full !h-[40px] !text-sm !bg-white !pl-12 !pr-3",
                  "!border !border-gray-300 !rounded-none",
                  "!shadow-xs !transition-[color,box-shadow] !outline-none",
                  "focus-visible:!ring-[1px] focus-visible:!ring-gray-500 focus-visible:!border-gray-500",
                  errors.phone && "!border-red-500 focus-visible:!ring-red-500"
                )}
                buttonClass={cn(
                  "!h-[40px] !border !border-gray-300 !bg-white !rounded-none",
                  "!shadow-xs",
                  "focus-visible:!ring-[1px] focus-visible:!ring-gray-500 focus-visible:!border-gray-500",
                  errors.phone && "!border-red-500 focus-visible:!ring-red-500"
                )}
                containerClass="!w-full !rounded-none"
                onChange={(value) => field.onChange("+" + value)}
              />
            )}
          />
          {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone.message}</p>}
        </div>

        {/* Password */}
        <div className="space-y-[4px]">
          <label className="block text-sm font-medium text-[#0E1620]">Password</label>
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
          {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
        </div>

        {/* Confirm Password */}
        <div className="space-y-[4px]">
          <label className="block text-sm font-medium text-[#0E1620]">Confirm Password</label>
          <div className="relative">
            <Input
              type={showConfirmPassword ? "text" : "password"}
              placeholder="•••••••••••••"
              {...register("confirmPassword")}
              className={`rounded-none ${errors.confirmPassword ? 'border-red-500' : ''}`}
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
          {errors.confirmPassword && (
            <p className="text-red-500 text-xs mt-1">{errors.confirmPassword.message}</p>
          )}
        </div>

        {/* Terms Checkbox */}
        <div className="space-y-[4px]">
          <div className="flex items-start gap-2 pt-1">
            <input
              type="checkbox"
              id="terms"
              {...register("terms")}
              className="w-4 h-4 mt-0.5 rounded border-gray-300 text-black focus:ring-black cursor-pointer accent-black"
            />
            <label htmlFor="terms" className="text-sm text-gray-600 leading-snug">
              I agree to the{" "}
              <Link href="/terms-and-conditions" className="text-[#000000] hover:underline">
                Terms & Conditions
              </Link>{" "}
              and{" "}
              <Link href="/privacy-policy" className="text-[#000000] hover:underline">
                Privacy Policy
              </Link>
            </label>
          </div>
          {errors.terms && <p className="text-red-500 text-xs">{errors.terms.message}</p>}
        </div>

        {/* Continue Button */}
        <Button
          type="submit"
          disabled={isPending}
          className="w-full bg-black hover:bg-gray-800 text-white font-medium h-11 sm:h-12 rounded-none transition-all text-base mt-2"
        >
          {isPending ? "Signing up..." : "Continue"}
        </Button>

        <div>
          <div className="relative flex items-center justify-center h-[32px] mb-[8px]">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-[#000000]"></span>
            </div>
            <div className="relative bg-white px-4">
              <span className="text-[#000000] text-sm">or sign up with</span>
            </div>
          </div>

          {configData?.google_login && (
            <div className="grid grid-cols-1">
              <Button
                type="button"
                variant="outline"
                onClick={() => signIn("google")}
                className="w-full h-11 flex items-center justify-center gap-2
                 border border-gray-300 bg-white text-black hover:bg-gray-50
                 rounded-none font-normal text-base"
              >
                <FcGoogle className="w-4 h-4" />
                Google
              </Button>
            </div>
          )}

          <div className="text-center mt-4">
            <p className="text-sm text-gray-500">Looking to list your business on our platform?</p>
            <Link
              href="/auth/business-login"
              className="text-sm font-medium text-black underline hover:no-underline"
            >
              Sign up as Business Account
            </Link>
          </div>

          {/* Footer Link */}
          <div className="text-[#000000] text-center mt-[32px]">
            <p className="text-sm">
              Already have an account?{" "}
              <Link
                href="/auth/login"
                className="text-[#000000] text-sm font-normal underline hover:no-underline">
                Sign In
              </Link>
            </p>
          </div>
        </div>
      </form>
    </div>
  );
}