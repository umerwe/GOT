import Footer from "@/components/layout/footer";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Terms of Use",
};

export default function Layout({ children }: { children: React.ReactNode }) {
    return <>
    {children}
    <Footer />
    </>;
}
