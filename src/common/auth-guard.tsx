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
    const token = localStorage.getItem("token");

    if (!token) {
      if (pathname.startsWith("/auth")) {
        setIsVerified(true);
      } else {
        redirectOnFail === "login"
          ? router.replace("/auth/login")
          : router.back();
      }
      return;
    }

    if (pathname.startsWith("/auth")) {
      router.replace("/");
      return;
    }

    setIsVerified(true);
  }, [pathname, router, redirectOnFail]);

  if (!isVerified) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader />
      </div>
    );
  }

  return <>{children}</>;
}