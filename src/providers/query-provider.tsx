"use client";

import { useEffect, useState } from "react";
import {
    QueryClient,
    QueryClientProvider,
} from "@tanstack/react-query";
import { Provider } from "react-redux";
import { store } from "@/store/store";
import { Toaster } from "../components/ui/toast";

export default function Providers({ children }: { children: React.ReactNode }) {
    const [queryClient] = useState(
        () =>
            new QueryClient({
                defaultOptions: {
                    queries: {
                        staleTime: 5 * 60 * 1000,
                        retry: 1,
                        refetchOnWindowFocus: false,
                    },
                },
            })
    );

    return (
        <Provider store={store}>
            <QueryClientProvider client={queryClient}>
                {/* <AuthEventsListener /> */}
                {children}
                <Toaster />
            </QueryClientProvider>
        </Provider>
    );
}
