"use client";

import { OrderSummaryProps } from "@/types/cart";
import PaymentMethods from "./paymentMethod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useAppSelector } from "@/store/hooks";
import LoginDialog from "@/utils/loginDialog";

const OrderSummary = ({
    cartItems,
    subtotal,
}: OrderSummaryProps) => {
    const router = useRouter();
    const [showLoginDialog, setShowLoginDialog] = useState(false);
    const isAuth = useAppSelector((state) => state?.auth?.token);

    const handleCheckout = (e: React.MouseEvent) => {
        if (!isAuth) {
            e.preventDefault(); // Stop the Link navigation
            setShowLoginDialog(true);
        }
    };

    return (
        <div className="lg:col-span-1">
            <div className="bg-[#F6F6F6] p-[20px] space-y-[20px]">
                <h2 className="text-[20px] text-gray-900 pb-[10px] border-b border-gray-900">Order summary</h2>

                <h1 className="text-sm text-gray-900 border-l-5 border-[#2D78CE] pl-[14px]">
                    The sales tax is calculated when you select your shipping address at checkout.
                </h1>

                <div className="space-y-[20px]">
                    <div className="flex justify-between font-semibold text-gray-900">
                        <span>My cart ({cartItems.length} items)</span>
                        <span>AED {subtotal.toLocaleString()}.00</span>
                    </div>

                    <button className="text-gray-900 text-sm underline cursor-pointer">
                        Add promotional code
                    </button>

                    <div>
                        <div className="flex justify-between font-semibold text-sm">
                            <span>Total (excluding delivery):</span>
                            <span>AED {subtotal.toLocaleString()}.00</span>
                        </div>
                    </div>
                </div>

                <Link
                    href="/checkout"
                    onClick={handleCheckout}
                >
                    <button
                        className="w-full bg-[#F2A416] hover:bg-[#e0941a] text-black h-[50px] text-sm font-semibold transition-colors">
                        Secure checkout
                    </button>
                </Link>
            </div>
            <PaymentMethods />

            <LoginDialog
                open={showLoginDialog}
                onOpenChange={setShowLoginDialog}
                description="Please login to your account to proceed with the checkout."
            />
        </div>
    )
}

export default OrderSummary