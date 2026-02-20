import React from "react";
import AuthGuard from "@/common/auth-guard";
import Navbar from "@/components/layout/navbar/nav";
import Footer from "@/components/layout/footer";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthGuard>
      <Navbar />
      <div className="bg-[#F3F4F6] pt-[61.5px] pb-[132.5px] ">
        {children}
      </div>
      <Footer />
    </AuthGuard>
  );
}