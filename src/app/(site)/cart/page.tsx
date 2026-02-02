"use client";

import { useState } from "react";
import CartCard from "../ads/cart-card";
import Breadcrumb from "@/components/ui/breadcrumb";
import Container from "@/components/container";
import OrderSummary from "@/components/pages/cart/order-summary";
import { CartItem } from "@/types/cart";
import Footer from "@/components/footer";

export default function CartPage() {
  const [cartItems, setCartItems] = useState<CartItem[]>([
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
  ]);

  const handleQuantityChange = (id: string, quantity: number) => {
    setCartItems(items =>
      items.map(item =>
        item.id === id ? { ...item, quantity } : item
      )
    );
  };

  const handleRemove = (id: string) => {
    setCartItems(items => items.filter(item => item.id !== id));
  };

  const handleAddToWishlist = (id: string) => {
    console.log("Added to wishlist:", id);
  };

  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <>
      <div className="lg:pl-[72px] lg:pr-[72px]">
        <Container className="mt-[17px]">
          <Breadcrumb
            items={[
              { title: "Home", href: "/" },
              { title: "Cart", href: `/cart` },
            ]}
          />
        </Container>

        <Container className="pt-[48px] pb-[98px] xl:pl-[80px] px-0">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg">
                <div className="flex justify-between items-center mb-[30px] py-[20px] border-b border-gray-900">
                  <h1 className="text-3xl font-semibold text-gray-900">Your cart</h1>
                  <span className="text-gray-900 font-medium text-base">{cartItems.length} items</span>
                </div>

                <div className="space-y-4">
                  {cartItems.map(item => (
                    <CartCard
                      key={item.id}
                      {...item}
                      onQuantityChange={handleQuantityChange}
                      onRemove={handleRemove}
                      onAddToWishlist={handleAddToWishlist}
                    />
                  ))}
                </div>
              </div>
            </div>

            <OrderSummary
              cartItems={cartItems}
              subtotal={subtotal}
            />
          </div>
        </Container>
      </div>
      <Footer />
    </>
  );
}
