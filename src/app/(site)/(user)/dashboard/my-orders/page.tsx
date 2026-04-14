import MyOrdersPage from "@/components/pages/my-orders";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "My Orders | Braaap",
};

export default function MyOrders() {
    return <MyOrdersPage />;
}