"use client";

import { ReactNode } from "react";

interface BusinessAuthPrivateProps {
    children: ReactNode;
}

export default function BusinessPrivateLayout({ children }: BusinessAuthPrivateProps) {
    return {children};
}