"use client";

import Loader from "@/common/loader";
import Navbar from "@/components/layout/navbar/nav";
import { useEffect, useState } from "react";

export default function BusinessLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const userType = localStorage.getItem("user_type") || "";

    if (userType === "user") {
      window.location.href = "/";
    } else {
      setLoading(false);
    }
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader />
      </div>
    );
  }

  return (
    <>
      <Navbar />
      {children}
    </>
  );
}