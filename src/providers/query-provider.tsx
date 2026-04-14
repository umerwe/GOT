"use client";

import { useState } from "react";
import { QueryClient, QueryClientProvider, QueryCache, MutationCache } from "@tanstack/react-query";
import { Provider } from "react-redux";
import { store } from "@/store/store";
import { Toaster } from "../components/ui/toast";
import TopLoader from "@/components/ui/toploader";
import { AxiosError } from "axios";

export default function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => {
    const handleUnauthorized = () => {
      if (typeof window !== "undefined") {
        localStorage.removeItem("token");
        window.location.href = "/auth/login";
      }
    };

    return new QueryClient({
      queryCache: new QueryCache({
        // Using AxiosError with a generic for your API response shape
        onError: (error) => {
          const axiosError = error as AxiosError;
          if (axiosError.response?.status === 401) {
            handleUnauthorized();
          }
        },
      }),
      mutationCache: new MutationCache({
        onError: (error) => {
          const axiosError = error as AxiosError;
          if (axiosError.response?.status === 401) {
            handleUnauthorized();
          }
        },
      }),
      defaultOptions: {
        queries: {
          staleTime: 5 * 60 * 1000,
          retry: 1,
          refetchOnWindowFocus: false,
        },
      },
    });
  });

  return (
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        {children}
        <Toaster />
        <TopLoader />
      </QueryClientProvider>
    </Provider>
  );
}