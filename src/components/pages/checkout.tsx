"use client";

import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import Breadcrumb from "@/components/ui/breadcrumb";
import Container from "@/components/container";
import OrderSummary from "@/components/pages/cart/order-summary";
import PaymentForm from "@/components/forms/checkout-form";
import Footer from "@/components/layout/footer";
import { useAppSelector } from "@/store/hooks";
import { useGetConfig } from "@/hooks/useConfig";
import { useSearchParams } from "next/navigation";

// ── Skeleton that mirrors the real layout ──────────────────────────
function CheckoutSkeleton() {
  return (
    <div className="flex flex-col lg:flex-row gap-[30px] items-start justify-center">
      {/* Left: PaymentForm skeleton */}
      <div className="w-full lg:w-[490px] shrink-0 border border-gray-200 p-[30px] bg-white space-y-[20px]">
        {/* Title */}
        <div className="h-6 w-24 bg-gray-200 animate-pulse rounded" />
        <div className="h-4 w-72 bg-gray-200 animate-pulse rounded" />
        <div className="h-px w-full bg-gray-200" />

        {/* Card method button */}
        <div className="h-[70px] w-[140px] bg-gray-200 animate-pulse rounded" />

        {/* Card number */}
        <div className="space-y-[6px]">
          <div className="h-4 w-20 bg-gray-200 animate-pulse rounded" />
          <div className="h-[54px] w-full bg-gray-200 animate-pulse rounded" />
        </div>

        {/* Expiry + CVC */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-[6px]">
            <div className="h-4 w-24 bg-gray-200 animate-pulse rounded" />
            <div className="h-[54px] w-full bg-gray-200 animate-pulse rounded" />
          </div>
          <div className="space-y-[6px]">
            <div className="h-4 w-24 bg-gray-200 animate-pulse rounded" />
            <div className="h-[54px] w-full bg-gray-200 animate-pulse rounded" />
          </div>
        </div>

        {/* Email */}
        <div className="h-[54px] w-full bg-gray-200 animate-pulse rounded" />
        {/* Phone */}
        <div className="h-[54px] w-full bg-gray-200 animate-pulse rounded" />

        {/* Country + Postal */}
        <div className="grid grid-cols-[1.8fr_1fr] gap-4">
          <div className="h-[54px] w-full bg-gray-200 animate-pulse rounded" />
          <div className="h-[54px] w-full bg-gray-200 animate-pulse rounded" />
        </div>

        {/* Submit button */}
        <div className="h-[64px] w-full bg-gray-200 animate-pulse rounded" />
      </div>

      {/* Right: OrderSummary skeleton */}
      <div className="w-full lg:w-[380px] shrink-0 lg:mt-[30px]">
        <div className="bg-[#F6F6F6] p-[20px] space-y-[20px]">
          <div className="h-6 w-32 bg-gray-300 animate-pulse rounded" />
          <div className="h-4 w-full bg-gray-300 animate-pulse rounded" />
          <div className="flex justify-between">
            <div className="h-4 w-28 bg-gray-300 animate-pulse rounded" />
            <div className="h-4 w-20 bg-gray-300 animate-pulse rounded" />
          </div>
          <div className="flex justify-between">
            <div className="h-4 w-36 bg-gray-300 animate-pulse rounded" />
            <div className="h-4 w-20 bg-gray-300 animate-pulse rounded" />
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Stripe error state ─────────────────────────────────────────────
function StripeConfigError() {
  return (
    <div className="flex flex-col lg:flex-row gap-[30px] items-start justify-center">
      <div className="w-full lg:w-[490px] shrink-0 border border-gray-200 p-[30px] bg-white">
        <div className="flex flex-col items-center text-center py-6 space-y-3">
          <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
            <svg className="w-6 h-6 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M12 3a9 9 0 100 18A9 9 0 0012 3z" />
            </svg>
          </div>
          <h3 className="text-gray-900 font-semibold text-lg">Payment Unavailable</h3>
          <p className="text-gray-500 text-sm leading-relaxed max-w-[320px]">
            We&apos;re having trouble loading the payment system. Please refresh the page or try again shortly.
          </p>
        </div>
      </div>
    </div>
  );
}

export default function CheckoutPage() {
  const { data, isLoading } = useGetConfig();
  const searchParams = useSearchParams();
  const isFeatureAd = searchParams.get("type") === "feature_ad";
  const productId = searchParams.get("product_id");
  const FEATURE_AD_FEE = 50;

  const stripePublishableKey = data?.test_stripe?.test_publishable_key;
  const stripePromise = stripePublishableKey ? loadStripe(stripePublishableKey) : null;

  const cartItems = useAppSelector((state) => state.cart.items);
  const subTotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const totalWithFee = isFeatureAd ? subTotal + FEATURE_AD_FEE : subTotal;

  return (
    <>
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
          {isLoading ? (
            <CheckoutSkeleton />
          ) : !stripePublishableKey ? (
            <StripeConfigError />
          ) : (
            <Elements stripe={stripePromise}>
              <div className="flex flex-col lg:flex-row gap-[30px] items-start justify-center">
                <div className="w-full lg:w-[490px] shrink-0">
                  <PaymentForm productId={productId || undefined} cartItems={cartItems} subTotal={subTotal} />
                </div>
                <div className="w-full lg:w-[380px] shrink-0 lg:mt-[30px]">
                  <OrderSummary
                    cartItems={cartItems}
                    subtotal={totalWithFee}
                    isFeatureAd={isFeatureAd}
                    featureAdFee={FEATURE_AD_FEE}
                  />
                </div>
              </div>
            </Elements>
          )}
        </Container>
      </div>
      <Footer />
    </>
  );
}