import { Suspense } from "react";
import Business from "@/components/pages/business/business";

export default function Page() {
  return (
    <Suspense fallback={<div className="h-[400px]" />}>
      <Business />
    </Suspense>
  );
}
