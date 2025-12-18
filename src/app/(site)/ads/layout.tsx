import Footer from "@/components/footer";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Ads",
};

export default function AdsLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <> 
            {children}
            <Footer />
        </>
    );
}
