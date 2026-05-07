import type { Metadata } from "next";
import Providers from "@/providers/query-provider";

import "./globals.css";
import { SessionProvider } from "next-auth/react";
import ChatListener from "@/components/chat-listner";
import NotificationProvider from "@/components/notificationProvider";
import { baseURL } from "@/config/constants";
import ResponseError from "@/components/response-error";

export const metadata: Metadata = {
  title: "Home | Braaap",
  icons: "/logo.png",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  let error: string | null = null;

  if (!baseURL) {
    error = "❌ No Base URL provided.";
  } else {
    try {
      const res = await fetch(baseURL, {
        method: "GET",
        cache: "no-store",
      });

      // 404 on root is fine — API root often returns 404
      // Only error on network-level failures or explicit server errors
      if (res.status >= 500) {
        error = `❌ Server error: ${res.status}`;
      }
    } catch (e) {
      error = "❌ Could not connect to server";
    }
  }

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&family=Russo+One&display=swap"
          rel="stylesheet"
        />
        <link href="https://fonts.googleapis.com/css2?family=Roboto:ital,wght@0,100..900;1,100..900&display=swap" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,100..1000;1,9..40,100..1000&display=swap" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/css2?family=Manrope:wght@200..800&display=swap" rel="stylesheet" />
      </head>

      <body>
        {error ? (
          <ResponseError className="h-screen" error={error} />
        ) : (
          <SessionProvider>
            <Providers>
              <ChatListener />
              <NotificationProvider />
              {children}
            </Providers>
          </SessionProvider>
        )}
      </body>
    </html>
  );
}