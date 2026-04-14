"use client";

import { useAppSelector, useAppDispatch } from "@/store/hooks";
import { addToCart } from "@/store/slices/CartSlice";
import { FavoriteItem, removeFromFavorites } from "@/store/slices/FavouriteSlice";
import Breadcrumb from "@/components/ui/breadcrumb";
import Container from "@/components/container";
import Footer from "@/components/layout/footer";
import { toast } from "@/components/ui/toast";
import CartCard from "@/app/(site)/(user)/categories/cart-card";

export default function Favorites() {
  const favoriteItems = useAppSelector((state) => state.favorites.items);
  const dispatch = useAppDispatch();

  const handleMoveToCart = (item: FavoriteItem) => {
    dispatch(addToCart({ 
        ...item, 
        quantity: 1, 
        business: item.businessId || 0 
    }));
    toast({ 
        title: "Added to Cart", 
        description: "Item has been successfully added to your cart." 
    });
  };

  const handleRemove = (id: number) => {
    dispatch(removeFromFavorites(id));
    toast({
      title: "Removed from Favorites"
    });
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
                    {favoriteItems.length} items
                  </span>
                </div>

                {/* Items List */}
                <div className="space-y-4">
                  {favoriteItems.length > 0 ? (
                    favoriteItems.map((item) => (
                      <CartCard
                        key={item.id}
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