"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Loader from "@/common/loader";

type AuthGuardProps = {
  children: React.ReactNode;
  redirectOnFail?: "login" | "back";
};

export default function AuthGuard({
  children,
  redirectOnFail = "login",
}: AuthGuardProps) {
  const [isVerified, setIsVerified] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem("token");

      if (!token) {
        if (pathname.startsWith("/auth")) {
          setIsVerified(true);
        } else {
          router.back();
        }
        return;
      }

      if (pathname.startsWith("/auth")) {
        router.back();
        return;
      }

      setIsVerified(true);
    };

    checkAuth();
  }, [pathname, router, redirectOnFail]);

  if (!isVerified && !pathname.startsWith("/auth")) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader />
      </div>
    );
  }

  return <>{children}</>;
}
