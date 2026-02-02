"use client";

import Breadcrumb from "@/components/ui/breadcrumb";
import Container from "@/components/container";
import OrderSummary from "@/components/pages/cart/order-summary";
import PaymentForm from "@/components/forms/checkout-form";
import Footer from "@/components/footer";

export default function CheckoutPage() {
    const cartItems = [
        {
            id: "1",
            name: "Honda CRF450X",
            price: 46827,
            image: "/bike-1.jpg",
            quantity: 1,
            details: ["2024", "500 miles", "450 CC"],
        },
        {
            id: "2",
            name: "KTM 500 EXC F",
            price: 46000,
            image: "/bike-parts.png",
            quantity: 1,
            details: ["2024", "300 miles", "500 CC"],
        },
        {
            id: "3",
            name: "Alpinestars SM5 Corp",
            price: 1022,
            image: "/accessories.png",
            quantity: 1,
            details: ["M", "Helmet"],
        },
    ];
    const subTotal = 982000;

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
                    <div className="flex flex-col lg:flex-row gap-[30px] items-start justify-center">
                        
                        {/* Left: Payment Details - Locked to 490px */}
                        <div className="w-full lg:w-[490px] shrink-0">
                            <PaymentForm />
                        </div>

                        {/* Right: Summary - Locked to 380px */}
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
        </>
    );
}