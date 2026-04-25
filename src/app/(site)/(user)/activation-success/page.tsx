"use client";

import { useEffect, Suspense, useRef } from "react";
import Container from "@/components/container";
import Footer from "@/components/layout/footer";
import { CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useActivateExtraAd, useAddProduct } from "@/hooks/useProduct";

function ActivationSuccessContent() {
  const { mutateAsync: activateExtraAd } = useActivateExtraAd();
  const { mutateAsync: addProduct } = useAddProduct();
  const hasCalled = useRef(false);

  useEffect(() => {
    const finalizeFlow = async () => {
      if (hasCalled.current) return;
      hasCalled.current = true;

      try {
        await activateExtraAd(undefined);

        const savedText = localStorage.getItem("ad_form_draft");
        const { get, del } = await import("idb-keyval");
        const savedImages = await get("ad_form_images_draft");

        if (
          !savedText ||
          !Array.isArray(savedImages) ||
          savedImages.length === 0  // ← KEY FIX
        ) {
          console.warn("⚠️ No draft data found in storage.");
          return;
        }

        const parsedData = JSON.parse(savedText);
        const finalForm = new FormData();

        Object.entries(parsedData).forEach(([key, val]) => {
          if (val === undefined || val === null || val === "" || val === false) return;
          finalForm.append(key, String(val));
        });

        // ✅ Reconstruct File from stored ArrayBuffer + metadata
        savedImages.forEach((stored: { name: string; type: string; buffer: ArrayBuffer }, index: number) => {
          const file = new File([stored.buffer], stored.name, { type: stored.type });
          finalForm.append(`product_images[${index}]`, file, file.name);
        });

        finalForm.set("negotiable", parsedData.negotiable ? "1" : "0");
        finalForm.set("user_type", "user");

        await addProduct(finalForm);

        localStorage.removeItem("ad_form_draft");
        await del("ad_form_images_draft");

      } catch (err) {
        console.error("❌ Flow failed:", err);
      }
    };

    finalizeFlow();
  }, []);

  return (
    <div className="max-w-[540px] w-full border border-gray-200 p-[30px] md:p-[50px] text-center space-y-8 bg-white shadow-sm mt-10 mb-20 mx-auto">
      <div className="flex justify-center">
        <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center">
          <CheckCircle2 className="w-12 h-12 text-green-500" />
        </div>
      </div>

      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-black">Payment Successful!</h1>
        <p className="text-gray-500">Your extra ad has been activated successfully.</p>
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

export default function ActivationSuccessPage() {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Container className="flex-1">
        <Suspense fallback={<div className="py-20 text-center font-medium text-gray-500">Processing your activation...</div>}>
          <ActivationSuccessContent />
        </Suspense>
      </Container>
      <Footer />
    </div>
  );
}