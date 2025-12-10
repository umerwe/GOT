import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Chat",
};

export default function AdsLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <>
            {children}
        </>
    );
}
