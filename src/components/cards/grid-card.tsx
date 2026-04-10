"use client";

import { Card, CardContent } from "@/components/ui/card";
import { capitalizeWords } from "@/utils/capitalizeWords";
import Link from "next/link";
import SkeletonLoader from "@/common/skeleton-loader";
import NotFoundWrapper from "@/common/not-found";
import { Heart } from "lucide-react";
import Image from "@/components/custom/MyImage";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { toggleFavorite } from "@/store/slices/FavouriteSlice";
import { cn } from "@/lib/utils";
import { toast } from "../ui/toast";

interface GridCardProps {
  isHome?: boolean;
  isAdsPage?: boolean;
  products?: Product[];
  isLoading?: boolean;
  count?: number;
  isSecond?: boolean;
  businessLogo?: string;
}

export default function GridCard({
  products = [],
  isLoading = false,
  count = 6,
  isAdsPage = false,
  businessLogo,
}: GridCardProps) {
  const dispatch = useAppDispatch();
  const favoriteItems = useAppSelector((state) => state.favorites.items);

  if (isLoading) return <SkeletonLoader type="products" count={count} isAdsPage={isAdsPage} />;
  if (!products || products.length === 0) return <NotFoundWrapper className="mt-[15px]" />;

  const handleToggleFavorite = (e: React.MouseEvent, product: Product) => {
    e.preventDefault();
    e.stopPropagation();

    const isCurrentlyFavorite = favoriteItems.some((item) => item.id === product.id);

    dispatch(
      toggleFavorite({
        id: product.id!,
        name: product.title,
        price: product.price,
        image: product.product_images?.[0] || "",
        details: [product.manufacturing_year, product.engine_size].filter(Boolean) as string[],
        businessId: product.seller?.id || 0,
      })
    );

    toast({
      title: isCurrentlyFavorite ? "Removed from Favorites" : "Added to Favorites",
    });
  };

  return (
    <div className={cn("grid grid-cols-2 gap-[10px]", isAdsPage ? "md:grid-cols-3" : "md:grid-cols-6")}>
      {products.map((product) => {
        const isFavorite = favoriteItems.some((item) => item.id === product.id);

        return (
          <div key={product.id} className="relative group">
            {/* 1. MOVE BUTTON OUTSIDE THE LINK */}
            <button
              onClick={(e) => handleToggleFavorite(e, product)}
              className="absolute bottom-[115px] right-2.5 z-30 bg-white/90 hover:bg-white p-2 rounded-full shadow-sm transition-all active:scale-90"
            >
              <Heart
                size={17}
                className={cn(
                  "transition-colors",
                  isFavorite ? "text-red-500 fill-red-500" : "text-gray-500"
                )}
              />
            </button>

            {/* 2. LINK ONLY WRAPS THE CARD CONTENT */}
            <Link href={`/listing/${product.id}`} className="block h-full">
              <Card className="overflow-hidden rounded-none shadow-none border-none cursor-pointer h-full">
                <div className="relative w-full h-[343px]">
                  <Image
                    src={product?.product_images?.[0] || "/placeholder.svg"}
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

                    {businessLogo && (
                      <div className="flex-shrink-0 w-[55px] h-[50px]">
                        <Image
                          src={businessLogo}
                          alt="Business Logo"
                          width={55}
                          height={50}
                          className="w-full h-full object-contain"
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
  );
}