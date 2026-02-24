"use client";

import { ReactNode, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useGetProfile } from "@/hooks/useProfile";
import Loader from "@/common/loader";

interface BusinessAuthPrivateProps {
    children: ReactNode;
}

export default function BusinessAuthPrivate({ children }: BusinessAuthPrivateProps) {
    const router = useRouter();
    const { data, isLoading } = useGetProfile();

    useEffect(() => {
    if (!isLoading) {
      if (!data ) {
        router.back();
      }
    }
  }, [data, isLoading, router]);

    if (isLoading || !data) {
        return (
            <Loader />
        );
    }

    return <>{children}</>;
}