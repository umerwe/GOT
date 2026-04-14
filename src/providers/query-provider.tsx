"use client";

import { useState } from "react";
import { QueryClient, QueryClientProvider, QueryCache, MutationCache } from "@tanstack/react-query";
import { Provider } from "react-redux";
import { store } from "@/store/store";
import { Toaster } from "../components/ui/toast";
import TopLoader from "@/components/ui/toploader";

export default function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => {
    const handleUnauthorized = () => {
      localStorage.removeItem("token");
      window.location.href = "/auth/login";
    };

    return new QueryClient({
      // Handles 401s from useQuery hooks
      queryCache: new QueryCache({
        onError: (error: any) => {
          if (error?.response?.status === 401) {
            handleUnauthorized();
          }
        },
      }),
      // Handles 401s from useMutation hooks
      mutationCache: new MutationCache({
        onError: (error: any) => {
          if (error?.response?.status === 401) {
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