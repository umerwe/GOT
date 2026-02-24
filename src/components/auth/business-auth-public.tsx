"use client";

import { ReactNode, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useGetProfile } from "@/hooks/useProfile";
import Loader from "@/common/loader";

interface BusinessAuthCheckProps {
    children: ReactNode;
}

export default function BusinessAuthCheck({ children }: BusinessAuthCheckProps) {
    const router = useRouter();
    const { data, isLoading } = useGetProfile();

    useEffect(() => {
        if (!isLoading && data) {
            router.back();
        }
    }, [data, isLoading, router]);

    if (isLoading || data) {
        return (
            <Loader />
        );
    }

    return <>{children}</>;
}