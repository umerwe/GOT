"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Container from "@/components/container";
import Footer from "@/components/footer";
import { XCircle, AlertCircle, RefreshCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

function FailContent() {
  const searchParams = useSearchParams();
  const errorMessage = searchParams.get("error") || "An unexpected error occurred during payment.";

  return (
    <div className="max-w-[540px] w-full border border-gray-200 p-[30px] md:p-[50px] text-center space-y-8 bg-white shadow-sm mt-10 mb-20 mx-auto">
      <div className="flex justify-center">
        <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center">
          <XCircle className="w-12 h-12 text-red-500" />
        </div>
      </div>

      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-[#111111]">Payment Failed</h1>
        <p className="text-gray-500">We couldn&apos;t process your request. Please check your card details and try again.</p>
      </div>

      {/* Error Message Box */}
      <div className="bg-red-50/50 border border-red-100 p-5 flex items-start gap-3 text-left">
        <AlertCircle className="text-red-500 shrink-0 mt-0.5" size={18} />
        <p className="text-sm text-red-800 font-medium leading-relaxed">
          Error: {errorMessage}
        </p>
      </div>

      <div className="flex flex-col gap-3 pt-4">
        <Link href="/checkout">
          <Button className="w-full h-[60px] bg-[#F2A416] hover:bg-[#D99314] text-gray-900 rounded-none font-bold text-sm transition-all uppercase flex items-center justify-center gap-2">
            <RefreshCcw size={18} />
            Try Again
          </Button>
        </Link>
        
        <Link href="/cart">
          <button className="w-full h-[50px] text-gray-400 hover:text-black transition-colors font-medium text-sm">
            Return to Cart
          </button>
        </Link>
      </div>
    </div>
  );
}

export default function FailPage() {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Container className="flex-1">
        <Suspense fallback={<div className="py-20 text-center">Loading...</div>}>
          <FailContent />
        </Suspense>
      </Container>
      <Footer />
    </div>
  );
}