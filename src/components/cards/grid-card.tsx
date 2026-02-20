"use client"

import { Card, CardContent } from "@/components/ui/card"
import { capitalizeWords } from "@/utils/capitalizeWords"
import Link from "next/link"
import SkeletonLoader from "@/common/skeleton-loader"
import NotFoundWrapper from "@/common/not-found"
import { Heart } from "lucide-react"
import Image from "@/components/custom/MyImage"

interface GridCardProps {
  isHome?: boolean
  isAdsPage?: boolean
  products?: Product[]
  isLoading?: boolean
  count?: number
  isSecond?: boolean
  vendorLogo?: string
}

export default function GridCard({
  products = [],
  isLoading = false,
  count = 4,
  isAdsPage = false,
  vendorLogo
}: GridCardProps) {
  if (isLoading) {
    return <SkeletonLoader type="products" count={count} />
  }

  if (!products || products.length === 0) {
    return (
      <NotFoundWrapper className="mt-[15px]" />
    )
  }

  return (
    <div className={`grid grid-cols-2 sm:grid-cols-2 gap-[10px] ${isAdsPage ? 'md:grid-cols-3' : 'md:grid-cols-4'}`}>
      {products.map((product) => (
        <Link key={product.id} href={`/listing/${product.id}`}>
          <Card className="overflow-hidden rounded-none shadow-none border-none cursor-pointer h-full">
            <div className="relative w-full h-[343px]">
              <Image
                src={product?.product_images?.[0] || ""}
                alt={product.title || "Product"}
                fill
                className="object-cover"
              />

              <button className="absolute bottom-3 right-2.5 z-20 bg-white/80 hover:bg-white p-2 rounded-full shadow-sm">
                <Heart size={17} className="text-gray-500 hover:text-red-500" />
              </button>
            </div>

            <CardContent className="pt-[17px] px-0 bg-transparent">
              <div className="flex justify-between items-start gap-2">
                <div className="flex-1 min-w-0">
                  <h1 className="text-base truncate font-medium" title={product.title}>
                    {capitalizeWords(product.title)}
                  </h1>

                  <div className="flex items-center flex-wrap gap-y-1 text-sm text-[#6A7282] mt-0.5">
                    <span className="text-gray-400">
                      {product.manufacturing_year || "N/A"}
                    </span>

                    <span className="text-gray-400 px-1">|</span>

                    <span className="text-gray-400">
                      {product.mileage ? `${product.mileage} ${product.mileage_unit || "km"}` : "0 km"}
                    </span>

                    <span className="text-gray-400 px-1">|</span>

                    <span className="text-gray-400">
                      {product.engine_size ? capitalizeWords(product.engine_size) : "-"}
                    </span>
                  </div>

                  <h2 className="text-[16px] font-bold mt-1.5">
                    AED {product.price.toLocaleString()}
                  </h2>
                </div>

                {/* BRAND IMAGE ON RIGHT */}
                {(vendorLogo) && (
                  <div className="flex-shrink-0 w-[55px] h-[50px]">
                    <Image
                      src={vendorLogo}
                      alt="Vendor"
                      width={55}
                      height={50}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </Link>
      ))}
    </div>
  )
}