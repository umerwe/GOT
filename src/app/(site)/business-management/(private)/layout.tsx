"use client";

import { ReactNode } from "react";
import BusinessAuthPrivate from "@/components/auth/business-auth-private";

interface BusinessAuthPrivateProps {
    children: ReactNode;
}

export default function BusinessPrivateLayout({ children }: BusinessAuthPrivateProps) {
    return <BusinessAuthPrivate>{children}</BusinessAuthPrivate>;
}