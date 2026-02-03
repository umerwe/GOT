import { Suspense } from "react";
import SellerPage from "@/components/pages/seller/seller";

export default function Page() {
  return (
    <Suspense fallback={<div className="h-[400px]" />}>
      <SellerPage />
    </Suspense>
  );
}
