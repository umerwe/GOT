"use client";

import { useAppDispatch } from "@/store/hooks";
import { addToCart } from "@/store/slices/CartSlice"
import Breadcrumb from "@/components/ui/breadcrumb";
import Container from "@/components/container";
import Footer from "@/components/layout/footer";
import { toast } from "@/components/ui/toast";
import CartCard from "@/app/(site)/(user)/categories/cart-card";
import { useGetWishlist, useToggleWishlist } from "@/hooks/favorites/useWishlist";
import { Skeleton } from "@/components/ui/skeleton";

export default function Favorites() {
  const dispatch = useAppDispatch();

  // Wishlist API integration
  const { data: wishlistData, isLoading } = useGetWishlist();
  const toggleWishlistMutation = useToggleWishlist();

  // Use wishlist data if available, otherwise fallback to Redux state
  const wishlistItems = wishlistData?.data;
  const isWishlistLoading = isLoading;

  const handleMoveToCart = (item: WishlistItem) => {
    dispatch(addToCart({ 
        ...item, 
        name: item.title,
        image: item.product_images[0],
        quantity: 1, 
        business: item.businessId || 0 
    }));
    toast({ 
        title: "Added to Cart", 
        description: "Item has been successfully added to your cart." 
    });
  };

  const handleRemove = (id: number) => {
    toggleWishlistMutation.mutate(String(id));
  };

  return (
    <>
      <div className="w-full lg:px-[72px]">
        {/* Breadcrumb Section */}
        <Container className="mt-[17px]">
          <Breadcrumb
            items={[
              { title: "Home", href: "/" },
              { title: "Favorites", href: `/favorites` },
            ]}
          />
        </Container>

        {/* Main Content Section */}
        <Container className="pt-[48px] pb-[98px]">
          {/* Centered grid to match CartPage spacing logic */}
          <div className="grid grid-cols-1 lg:grid-cols-[715px] justify-center">
            
            <div className="w-full">
              <div className="bg-white rounded-lg">
                {/* Header matching CartPage style */}
                <div className="flex justify-between items-center mb-[30px] py-[20px] border-b border-gray-900">
                  <h1 className="text-3xl font-semibold text-gray-900">My Favorites</h1>
                  <span className="text-gray-900 font-medium text-base">
                    {isWishlistLoading ? (
                      <Skeleton className="h-6 w-16" />
                    ) : (
                      `${wishlistItems.length} items`
                    )}
                  </span>
                </div>

                {/* Items List */}
                <div className="space-y-4">
                  {isWishlistLoading ? (
                    <div className="space-y-4">
                      {Array.from({ length: 3 }).map((_, index) => (
                        <div key={index} className="animate-pulse">
                          <div className="relative flex flex-col sm:flex-row w-full gap-5 sm:gap-[30px] py-5 pr-0 sm:pr-5 border-b border-gray-100 bg-white">
                            {/* Remove button placeholder */}
                            <div className="absolute right-2 top-7 sm:right-5 sm:top-5 w-5 h-5 bg-gray-200 rounded" />
                            
                            {/* Image placeholder */}
                            <div className="flex flex-col gap-2 flex-shrink-0 w-full sm:w-[196px]">
                              <div className="relative overflow-hidden w-full h-[200px] sm:w-[196px] sm:h-[141px] bg-gray-200 rounded-none" />
                            </div>

                            {/* Content section */}
                            <div className="flex flex-1 flex-col justify-between py-1 px-2 sm:px-0">
                              <div className="space-y-[10px]">
                                {/* Title skeleton */}
                                <div className="h-[22px] w-[90%] bg-gray-200 rounded leading-tight" />
                                
                                {/* Details skeleton */}
                                <div className="flex flex-wrap items-center gap-y-1">
                                  <div className="h-[14px] w-16 bg-gray-200 rounded" />
                                  <span className="mx-1.5 text-gray-200">|</span>
                                  <div className="h-[14px] w-20 bg-gray-200 rounded" />
                                  <span className="mx-1.5 text-gray-200">|</span>
                                  <div className="h-[14px] w-16 bg-gray-200 rounded" />
                                </div>

                                {/* Price skeleton */}
                                <div className="h-[16px] w-24 bg-gray-200 rounded" />
                              </div>

                              {/* Action button skeleton */}
                              <div className="flex flex-wrap items-center justify-between mt-6 gap-4">
                                <div className="h-8 w-32 bg-gray-200 rounded flex items-center justify-center">
                                  <div className="w-4 h-4 bg-gray-300 rounded mr-2" />
                                  <div className="w-16 h-4 bg-gray-300 rounded" />
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : wishlistItems.length > 0 ? (
                    wishlistItems.map((item:WishlistItem) => (
                      <CartCard
                        key={item.id}
                        name={item.title}
                        image={item.product_images[0]}
                        {...item}
                        quantity={1}
                        business={item.businessId || 0}
                        variant="favorite"
                        onRemove={() => handleRemove(item.id)}
                        onAction={() => handleMoveToCart(item)}
                      />
                    ))
                  ) : (
                    <div className="py-20 text-center text-gray-500 bg-gray-50/50 rounded-lg border-2 border-dashed">
                      Your favorites list is empty.
                    </div>
                  )}
                </div>
              </div>
            </div>

          </div>
        </Container>
      </div>
      <Footer />
    </>
  );
}