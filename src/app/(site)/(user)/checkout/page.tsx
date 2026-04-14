import CheckoutPage from "@/components/pages/checkout";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Checkout | Braaap",
};

export default function Checkout() {
    return <CheckoutPage />;
}