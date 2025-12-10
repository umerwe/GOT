"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function ResetCode() {
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleVerify = () => {
    if (code === "1234") {
      setError("");
      router.push("/auth/reset-password");
    } else {
      setError("Incorrect or wrong code");
    }
  };

  return (
    <>
      <h2 className="text-2xl font-bold text-center mb-6">
        Enter Verification Code
      </h2>

      <label className="block mb-1 font-medium">Code</label>
      <Input
        type="text"
        placeholder="Enter code"
        // withIcon={false}
        value={code}
        onChange={(e) => setCode(e.target.value)}
        className="mb-2 rounded-md"
      />

      {error && <p className="text-red-500 text-sm mb-3">{error}</p>}

      <Button
        onClick={handleVerify}
        className="w-full bg-yellow-400 text-black font-semibold mb-4 rounded-md"
      >
        Verify Code
      </Button>
    </>
  );
}
