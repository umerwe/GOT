"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { Eye, EyeOff } from "lucide-react";

export default function ResetPassword() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const router = useRouter();

  const handleReset = () => {
    setError("");
    setSuccess("");

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    // TODO: API call to reset password
    setSuccess("Password reset successful!");
    setTimeout(() => {
      router.push("/auth/login");
    }, 1500);
  };

  return (
    <div className="w-full max-w-[450px] mx-auto bg-white p-[24px]">
      {/* Header Section */}
      <div className="mb-[24px]">
        <h5 className="text-[22px] text-[#000000] h-[35px]">Reset Password</h5>
        <p className="text-[#000000] text-[14px]">
          Create a strong new password to secure your account.
        </p>
      </div>

      <div className="space-y-[24px]">
        {/* New Password Field */}
        <div className="space-y-[4px]">
          <label className="block text-sm font-normal text-[#0E1620]">New Password</label>
          <div className="relative">
            <Input
              type={showPassword ? "text" : "password"}
              placeholder="•••••••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="rounded-none"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Confirm Password Field */}
        <div className="space-y-[4px]">
          <label className="block text-sm font-normal text-[#0E1620]">Confirm Password</label>
          <div className="relative">
            <Input
              type={showConfirmPassword ? "text" : "password"}
              placeholder="•••••••••••••"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="rounded-none"
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Action Button */}
        <Button
          onClick={handleReset}
          className="w-full bg-black hover:bg-gray-800 text-white font-medium h-11 sm:h-12 rounded-none transition-all text-base"
        >
          Save Password
        </Button>

        {/* Status Messages */}
        <div className="mt-4">
          {error && <p className="text-red-600 text-[14px] text-center font-light">{error}</p>}
          {success && (
            <p className="text-green-600 text-[14px] text-center font-light">{success}</p>
          )}
        </div>
      </div>
    </div>
  );
}