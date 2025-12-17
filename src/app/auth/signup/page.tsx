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
    <div className="w-full max-w-[450px] mx-auto bg-white p-4 sm:p-8">
      {/* Header Section */}
      <div className="mb-8">
        <h2 className="text-xl font-bold text-[#000000]">User Sign Up</h2>
        <p className="text-gray-600 text-sm">
          Create an account to get started
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Full Name */}
        <div className="space-y-1.5">
          <label className="block text-sm font-medium text-gray-700">Full Name</label>
          <Input
            type="text"
            placeholder="Enter Your Name"
            {...register("name")}
            className="rounded-none"
          />
          {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
        </div>

        {/* Email */}
        <div className="space-y-1.5">
          <label className="block text-sm font-medium text-gray-700">Email Address</label>
          <Input
            type="email"
            placeholder="twinum@example.com"
            {...register("email")}
            className="rounded-none"
          />
          {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
        </div>

        {/* Phone */}
        <div className="space-y-1.5">
          <label className="block text-sm font-medium text-gray-700">Phone</label>
          <Controller
            name="phone"
            control={control}
            render={({ field }) => (
              <PhoneInput
                {...field}
                country={"pk"}
                enableSearch
                inputClass={`!w-full !h-10 sm:!h-10 !text-sm !rounded-none !border-gray-300 focus:!ring-black focus:!border-black ${errors.phone ? "!border-red-500" : ""
                  }`}
                buttonClass={`!h-10 sm:!h-10 !rounded-none ${errors.phone ? "!border-red-500" : "!border-gray-300"
                  }`}
                onChange={(value) => field.onChange("+" + value)}
              />
            )}
          />
          {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone.message}</p>}
        </div>

        {/* Password */}
        <div className="space-y-1.5">
          <label className="block text-sm font-medium text-gray-700">Password</label>
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
          {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
        </div>

        {/* Confirm Password */}
        <div className="space-y-1.5">
          <label className="block text-sm font-medium text-gray-700">Confirm Password</label>
          <div className="relative">
            <Input
              type={showConfirmPassword ? "text" : "password"}
              placeholder="•••••••••••••"
              {...register("confirmPassword")}
              className="rounded-none"
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              {showConfirmPassword ? <FaEyeSlash size={18} /> : <FaEye size={18} />}
            </button>
          </div>
          {errors.confirmPassword && (
            <p className="text-red-500 text-xs mt-1">{errors.confirmPassword.message}</p>
          )}
        </div>

        {/* Terms Checkbox */}
        <div className="space-y-1">
          <div className="flex items-start gap-2 pt-1">
            <input
              type="checkbox"
              id="terms"
              {...register("terms")}
              className="w-4 h-4 mt-0.5 rounded border-gray-300 text-black focus:ring-black cursor-pointer accent-black"
            />
            <label htmlFor="terms" className="text-sm text-gray-600 leading-snug">
              I agree to the{" "}
              <Link href="/terms-and-conditions" className="text-[#000000] font-semibold hover:underline">
                Terms & Conditions
              </Link>{" "}
              and{" "}
              <Link href="/privacy-policy" className="text-[#000000] font-semibold hover:underline">
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
          className="w-full bg-black hover:bg-gray-800 text-white font-medium h-11 sm:h-12 rounded-md transition-all text-base mt-2"
        >
          {isPending ? "Signing up..." : "Continue"}
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
            Already have an account?{" "}
            <Link href="/auth/login" className="text-[#000000] font-bold underline hover:no-underline">
              Sign In
            </Link>
          </p>
        </div>
      </form>
    </div>
  );
}