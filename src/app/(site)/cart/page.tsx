"use client";

import { useAppSelector, useAppDispatch } from "@/store/hooks";
import { removeFromCart, updateQuantity } from "@/store/slices/CartSlice";
import CartCard from "../ads/cart-card";
import Breadcrumb from "@/components/ui/breadcrumb";
import Container from "@/components/container";
import OrderSummary from "@/components/pages/cart/order-summary";
import Footer from "@/components/layout/footer";

export default function CartPage() {
  const cartItems = useAppSelector((state) => state.cart.items);
  const dispatch = useAppDispatch();

  const handleQuantityChange = (id: number, quantity: number) => {
    dispatch(updateQuantity({ id, quantity }));
  };

  const handleRemove = (id: number) => {
    dispatch(removeFromCart(id));
  };

  const handleAddToWishlist = (id: number) => {
    console.log("Added to wishlist:", id);
  };

  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <>
      <div className="w-full lg:px-[72px] ">
        <Container className="mt-[17px]">
          <Breadcrumb
            items={[
              { title: "Home", href: "/" },
              { title: "Cart", href: `/cart` },
            ]}
          />
        </Container>

        <Container className="pt-[48px] pb-[98px]">
          <div className="grid grid-cols-1 lg:grid-cols-[715px_380px] gap-[30px] justify-center">

            <div className="w-full lg:max-w-[715px]">
              <div className="bg-white rounded-lg">
                <div className="flex justify-between items-center mb-[30px] py-[20px] border-b border-gray-900">
                  <h1 className="text-3xl font-semibold text-gray-900">Your cart</h1>
                  <span className="text-gray-900 font-medium text-base">{cartItems.length} items</span>
                </div>

                <div className="space-y-4">
                  {cartItems.length > 0 ? (
                    cartItems.map(item => (
                      <CartCard
                        key={item.id}
                        {...item}
                        onQuantityChange={handleQuantityChange}
                        onRemove={handleRemove}
                        onAddToWishlist={handleAddToWishlist}
                      />
                    ))
                  ) : (
                    <div className="py-10 text-center text-gray-500">
                      Your cart is empty.
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="w-full lg:max-w-[380px]">
              <OrderSummary
                cartItems={cartItems}
                subtotal={subtotal}
              />
            </div>
          </div>
        </Container>
      </div>
      <Footer />
    </>
  );
}