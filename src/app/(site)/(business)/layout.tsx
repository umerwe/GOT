import Navbar from "@/components/layout/navbar/nav";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Business Management"
};

export default function BusinessLayout({
    children,
}: {
    children: React.ReactNode;
}) {

    return (
        <>
            <Navbar />
            {children}
        </>
    );
}