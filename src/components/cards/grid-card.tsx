"use client";

import { Card, CardContent } from "@/components/ui/card";
import { capitalizeWords } from "@/utils/capitalizeWords";
import Link from "next/link";
import SkeletonLoader from "@/common/skeleton-loader";
import NotFoundWrapper from "@/common/not-found";
import { Heart } from "lucide-react";
import Image from "@/components/custom/MyImage";
import { useToggleWishlist, useGetWishlist } from "@/hooks/favorites/useWishlist";
import { cn } from "@/lib/utils";
import { useState } from "react";
import LoginDialog from "@/components/dialogs/loginDialog";
import { useRouter } from "next/navigation";

interface GridCardProps {
  isHome?: boolean;
  isAdsPage?: boolean;
  products?: Product[];
  isLoading?: boolean;
  count?: number;
  isSecond?: boolean;
  businessLogo?: string;
  isBusinessPage?: boolean;
  isPrivate?: boolean;
  isFeatured?: boolean;
}

export default function GridCard({
  products = [],
  isLoading = false,
  count = 6,
  isAdsPage = false,
  businessLogo,
  isBusinessPage = false,
  isPrivate = false,
  isFeatured = false,
}: GridCardProps) {
  const { data: wishlistData } = useGetWishlist();
  const {mutate: toggleWishlistMutation,isPending} = useToggleWishlist();
  const [isLoginDialogOpen, setIsLoginDialogOpen] = useState(false);
  const router = useRouter();

  const wishlistItems = wishlistData?.data;

  if (isLoading) return <SkeletonLoader type="products" count={count} isAdsPage={isAdsPage} />;
  if (!products || products.length === 0) return <NotFoundWrapper className={isBusinessPage ? "mt-[125px]" : "mt-[15px]"} isFeatured={isFeatured} />;

  const handleToggleFavorite = (e: React.MouseEvent, product: Product) => {
    e.preventDefault();
    e.stopPropagation();

    const token = localStorage.getItem("token");
    if (!token) {
      setIsLoginDialogOpen(true);
      return;
    }

    toggleWishlistMutation(String(product.id));
  };

  const handleBusinessClick = (e: React.MouseEvent, sellerId: number | undefined) => {
    e.preventDefault();
    e.stopPropagation();
    router.push(`/business/${sellerId}`);
  };

  return (
    <>
      <div className={cn(
        "flex overflow-x-auto pb-4 gap-[10px] scrollbar-hide sm:pb-0 sm:overflow-visible sm:grid",
        isAdsPage ? "sm:grid-cols-3" : "sm:grid-cols-6"
      )}>
        {products.map((product) => {
          const isFavorite = wishlistItems?.some((item : WishlistItem) => item.id === product.id);

          return (
            <div key={product.id} className="relative group min-w-[280px] sm:min-w-full">
              <button
                onClick={(e) => handleToggleFavorite(e, product)}
                disabled={isPending}
                className="absolute bottom-[115px] right-2.5 z-30 bg-white/90 hover:bg-white p-2 cursor-pointer rounded-full shadow-sm transition-all active:scale-90"
              >
                <Heart
                  size={17}
                  className={cn(
                    "transition-colors",
                    isFavorite ? "text-red-500 fill-red-500" : "text-gray-500"
                  )}
                />
              </button>

              <Link href={`/listing/${product.id}`} className="block h-full">
                <Card className="overflow-hidden rounded-none shadow-none border-none cursor-pointer h-full">
                  <div className="relative w-full h-[343px]">
                    <Image
                      src={product?.product_images?.[0] || "/fallback.png"}
                      alt={product.title || "Product"}
                      fill
                      className="object-cover"
                    />
                  </div>

                  <CardContent className="pt-[17px] px-0 bg-transparent">
                    <div className="flex justify-between items-start gap-2">
                      <div className="flex-1 min-w-0">
                        <h1 className="text-base truncate font-medium" title={product.title}>
                          {capitalizeWords(product.title)}
                        </h1>

                        <div className="flex items-center flex-wrap gap-y-1 text-sm text-[#6A7282] mt-0.5">
                          <span>{product.manufacturing_year || "N/A"}</span>
                          <span className="px-1 text-gray-300">|</span>
                          <span>
                            {product.mileage
                              ? `${product.mileage} ${product.mileage_unit || "km"}`
                              : "0 km"}
                          </span>
                        </div>

                        <h2 className="text-[16px] font-bold mt-1.5 text-black">
                          AED {product.price.toLocaleString()}
                        </h2>
                      </div>

                      {(businessLogo || isPrivate) && (
                        <div 
                          onClick={(e) => handleBusinessClick(e, product?.seller?.id)}
                          className="flex-shrink-0 w-[50px] h-[50px] cursor-pointer"
                        >
                          <Image
                            src={product?.seller?.profile_image || "/fallback.png"}
                            alt="Business Logo"
                            width={256}
                            height={256}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </Link>
            </div>
          );
        })}
      </div>

      <LoginDialog
        open={isLoginDialogOpen}
        onOpenChange={setIsLoginDialogOpen}
      />
    </>
  );
}