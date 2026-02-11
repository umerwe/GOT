// components/AuthEventsListener.tsx
"use client";

import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { logout } from "@/store/slices/AuthSlice";
import { useRouter } from "next/navigation";

export default function AuthEventsListener() {
  const dispatch = useDispatch();
  const router = useRouter();

  useEffect(() => {
    const handleUnauthorized = () => {
      dispatch(logout());
      // router.back()
    };

    window.addEventListener("unauthorized", handleUnauthorized);
    return () => {
      window.removeEventListener("unauthorized", handleUnauthorized);
    };
  }, [dispatch, router]);

  return null;
}
