"use client";

import { useEffect, Suspense, useRef } from "react";
import { useSearchParams } from "next/navigation";
import Container from "@/components/container";
import Footer from "@/components/layout/footer";
import { CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useMakeProductFeatured } from "@/hooks/useProduct";

function FeatureAdSuccessContent() {
  const searchParams = useSearchParams();
  const productId = searchParams.get("product_id");

  const { mutate: makeProductFeatured } = useMakeProductFeatured();


  const hasCalled = useRef(false);

  useEffect(() => {
    if (!productId || hasCalled.current) return;

    hasCalled.current = true;

    makeProductFeatured(productId);

  }, [productId, makeProductFeatured]);

  return (
    <div className="max-w-[540px] w-full border border-gray-200 p-[30px] md:p-[50px] text-center space-y-8 bg-white shadow-sm mt-10 mb-20 mx-auto">
      <div className="flex justify-center">
        <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center">
          <CheckCircle2 className="w-12 h-12 text-green-500" />
        </div>
      </div>

      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-black">Payment Successful!</h1>
        <p className="text-gray-500">Your ad has been featured successfully.</p>
      </div>

      <div className="flex flex-col gap-3">
        <Link href="/dashboard/status/all">
          <Button className="w-full h-[60px] bg-black hover:bg-black text-white rounded-none font-bold text-sm transition-all uppercase">
            View My Ads
          </Button>
        </Link>
        <Link href="/">
          <button className="w-full h-[50px] text-gray-400 hover:text-black transition-colors font-medium text-sm">
            Back to Homepage
          </button>
        </Link>
      </div>
    </div>
  );
}

export default function FeatureAdSuccessPage() {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Container className="flex-1">
        <Suspense fallback={<div className="py-20 text-center">Processing...</div>}>
          <FeatureAdSuccessContent />
        </Suspense>
      </Container>
      <Footer />
    </div>
  );
}