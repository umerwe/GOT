import Footer from "@/components/layout/footer";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Categories | Braaap",
};

export default function CategoriesLayout({
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
