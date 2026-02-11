import { Suspense } from "react";
import Vendor from "@/components/pages/vendor/vendor";

export default function Page() {
  return (
    <Suspense fallback={<div className="h-[400px]" />}>
      <Vendor />
    </Suspense>
  );
}
