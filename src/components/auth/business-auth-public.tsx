"use client";

import { ReactNode, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Loader from "@/common/loader";

interface BusinessAuthCheckProps {
  children: ReactNode;
}

export default function BusinessAuthCheck({ children }: BusinessAuthCheckProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const userType = localStorage.getItem("user_type") || "";

    if (userType === "business") {
      router.replace("/business-management/verification");
    } else {
      setLoading(false);
    }
  }, [router]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader />
      </div>
    );
  }

  return <>{children}</>;
}