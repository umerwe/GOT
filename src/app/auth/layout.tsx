import React from "react";
import Link from "next/link";
import Image from "next/image";
import AuthGuard from "@/common/auth-guard";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthGuard>
      <Navbar />
      <div className="bg-[#F3F4F6] py-14">
        {children}
      </div>
      <Footer />
    </AuthGuard>
  );
}