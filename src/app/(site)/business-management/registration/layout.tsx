import type { Metadata } from "next";
import { ReactNode } from "react";
import BusinessAuthCheck from "@/components/auth/business-auth-public";

export const metadata: Metadata = {
  title: "Business Management",
};

interface BusinessManagementLayoutProps {
  children: ReactNode;
}

export default function BusinessRegistrationLayout({ children }: BusinessManagementLayoutProps) {
  return <BusinessAuthCheck>{children}</BusinessAuthCheck>;
}