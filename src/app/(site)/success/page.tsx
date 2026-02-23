"use client";

import { useEffect, Suspense, useRef } from "react";
import { useSearchParams } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import Container from "@/components/container";
import Footer from "@/components/layout/footer";
import { CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useSaveOrder } from "@/hooks/useOrder";
import { clearCart } from "@/store/slices/CartSlice";

function SuccessContent() {
  const dispatch = useAppDispatch();
  const { mutate } = useSaveOrder();
  const cartItems = useAppSelector((state) => state.cart.items);
  const searchParams = useSearchParams();
  const transactionId = searchParams.get("tid") || "N/A";
  
  const hasCalled = useRef(false);

  useEffect(() => {
    // 1. Initial Guards
    if (!cartItems || cartItems.length === 0 || hasCalled.current) return;

    // 2. Lock the effect
    hasCalled.current = true;

    const totalAmount = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

    const orderPayload = {
      order_amount: totalAmount,
      payment_method: "stripe",
      payment_status: "paid",
      delivery_address: "",
      order_note: null,
      business_id: cartItems[0].business,
      transaction_id: transactionId,
      coupon_code: null,
      products: cartItems.map((item) => ({
        product_id: Number(item.id),
        quantity: item.quantity,
        price: item.price,
      })),
    };

    mutate(orderPayload, {
      onSuccess: () => {
        // // 3. Clear Redux State and LocalStorage
        // dispatch(clearCart());
        // console.log("Cart cleared successfully");
      },
      onError: (error) => {
        console.error("Order save failed:", error);
        hasCalled.current = false;
      }
    });

    // We only want this to run once on mount when cartItems are present
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); 

  return (
    <div className="max-w-[540px] w-full border border-gray-200 p-[30px] md:p-[50px] text-center space-y-8 bg-white shadow-sm mt-10 mb-20 mx-auto">
      <div className="flex justify-center">
        <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center">
          <CheckCircle2 className="w-12 h-12 text-green-500" />
        </div>
      </div>

      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-black">Payment Successful!</h1>
        <p className="text-gray-500">Thank you for your purchase. Your transaction has been completed successfully.</p>
      </div>

      <div className="flex flex-col gap-3">
        <Link href="/dashboard/my-orders">
          <Button className="w-full h-[60px] bg-black hover:bg-black text-white rounded-none font-bold text-sm transition-all uppercase">
            Check Orders
          </Button>
        </Link>
        <Link href="/">
          <button className="w-full h-[50px] text-gray-400 hover:text-black transition-colors font-medium text-sm">
            Back to Homepage
          </button>
        </Link>
      </div>
    </div>
  );
}

export default function SuccessPage() {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Container className="flex-1">
        <Suspense fallback={<div className="py-20 text-center">Processing...</div>}>
          <SuccessContent />
        </Suspense>
      </Container>
      <Footer />
    </div>
  );
}