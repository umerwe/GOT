"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function ResetPassword() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
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
    <>
      <h2 className="text-2xl font-bold text-center mb-6">Reset Password</h2>

      <label className="block mb-1 font-medium">New Password</label>
      <Input
        type="password"
        placeholder="Enter New Password"
        // withIcon={false}
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="mb-4 rounded-md"
      />

      <label className="block mb-1 font-medium">Confirm Password</label>
      <Input
        type="password"
        placeholder="Confirm Password"
        // withIcon={false}
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
        className="mb-4 rounded-md"
      />

      <Button
        onClick={handleReset}
        className="w-full bg-yellow-400 text-black font-semibold mb-4"
      >
        Save Password
      </Button>

      {error && <p className="text-red-500 text-sm text-center">{error}</p>}
      {success && (
        <p className="text-green-600 text-sm text-center">{success}</p>
      )}
    </>
  );
}
