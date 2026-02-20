"use client";

import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import Breadcrumb from "@/components/ui/breadcrumb";
import Container from "@/components/container";
import OrderSummary from "@/components/pages/cart/order-summary";
import PaymentForm from "@/components/forms/checkout-form";
import Footer from "@/components/layout/footer";
import { useAppSelector } from "@/store/hooks";

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY!);

export default function CheckoutPage() {
  const cartItems = useAppSelector((state) => state.cart.items);
  const subTotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <Elements stripe={stripePromise}>
      <div className="lg:px-[72px] min-h-screen bg-white">
        <Container className="mt-[17px]">
          <Breadcrumb
            items={[
              { title: "Home", href: "/" },
              { title: "Checkout", href: "/checkout" },
            ]}
          />
        </Container>

        <Container className="pt-[28px] pb-[98px]">
          <div className="flex flex-col lg:flex-row gap-[30px] items-start justify-center">
            
            <div className="w-full lg:w-[490px] shrink-0">
              <PaymentForm />
            </div>

            {/* Right: Summary */}
            <div className="w-full lg:w-[380px] shrink-0 lg:mt-[30px]">
              <OrderSummary
                cartItems={cartItems}
                subtotal={subTotal}
              />
            </div>
            
          </div>
        </Container>
      </div>
      <Footer />
    </Elements>
  );
}