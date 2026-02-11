"use client";

import { useRouter } from "next/navigation";
import { AlertCircle, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

interface NotFoundWrapperProps {
  itemName?: string;
  className ?: string
}

export default function NotFoundWrapper({ itemName ,className = "min-h-screen"}: NotFoundWrapperProps) {
  const router = useRouter();

  return (
    <div className={`flex flex-col justify-center items-center ${className} p-6 pb-0`}>
      <AlertCircle className="w-16 h-16 text-solid mb-3 animate-bounce" />
      <h1 className="text-2xl font-bold text-gray-800 mb-2">
        {itemName} Not Found
      </h1>
      <p className="text-gray-600 text-center max-w-sm">
        Sorry, the {itemName?.toLowerCase()} you are looking for doesn’t exist
        or has been removed.
      </p>
      {/* <Button
        variant="default"
        className="flex items-center gap-2"
        onClick={() => router.back()}
      >
        <ArrowLeft className="w-4 h-4" />
        Back
      </Button> */}
    </div>
  );
}
