import { OrderSummaryProps } from "@/types/cart";
import PaymentMethods from "./paymentMethod";
import Link from "next/link"

const OrderSummary = ({
    cartItems,
    subtotal,
}: OrderSummaryProps) => {
    return (
        <div className="lg:col-span-1">
            <div className="bg-[#F6F6F6] p-[20px] space-y-[20px]">
                <h2 className="text-[20px] text-gray-900 pb-[10px] border-b border-gray-900">Order summary</h2>

                <h1 className="text-sm text-gray-900">
                    Sales tax will be calculated during checkout where applicable
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
                >
                    <button
                        className="w-full bg-[#F2A416] hover:bg-[#e0941a] text-black h-[50px] text-sm font-semibold transition-colors">
                        Secure checkout
                    </button>
                </Link>
            </div>
            <PaymentMethods />
        </div>
    )
}

export default OrderSummary
