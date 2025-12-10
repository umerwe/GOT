"use client";

import { useEffect, useState } from "react";
import {
    QueryClient,
    QueryClientProvider,
} from "@tanstack/react-query";
import { Provider, useDispatch } from "react-redux";
import { store } from "@/store/store";
import { Toaster } from "../components/ui/toast";
import AuthEventsListener from "@/components/auth-events-listner";
import { useGetConfig } from "@/hooks/useConfig";
import { setConfig } from "@/store/slices/ConfigSlice";

function ConfigLoader({ children }: { children: React.ReactNode }) {
    const dispatch = useDispatch();
    const { data, isSuccess } = useGetConfig();

    useEffect(() => {
        if (isSuccess && data) {
            dispatch(setConfig(data));
        }
    }, [isSuccess, data, dispatch]);

    return <>{children}</>;
}

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
                <AuthEventsListener />
                <ConfigLoader>{children}</ConfigLoader>
                <Toaster />
            </QueryClientProvider>
        </Provider>
    );
}
