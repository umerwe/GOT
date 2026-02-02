"use client"

import { Card, CardContent } from "@/components/ui/card"
import { capitalizeWords } from "@/utils/capitalizeWords"
import Image from "next/image"
import Link from "next/link"
import SkeletonLoader from "@/common/skeleton-loader"
import NotFoundWrapper from "@/common/not-found"

interface GridCardProps {
  isHome?: boolean
  isAdsPage?: boolean
  products?: Product[]
  isLoading?: boolean
  count?: number
}

export default function GridCard({
  products = [],
  isLoading = false,
  count = 4,
  isAdsPage = false,
}: GridCardProps) {
  if (isLoading) {
    return <SkeletonLoader type="products" count={count} />
  }

  if (!products || products.length === 0) {
    return (
      <NotFoundWrapper className="mt-20" />
    )
  }

  return (
    <div className={`grid grid-cols-2 sm:grid-cols-2  gap-[10px] ${isAdsPage ? 'md:grid-cols-3' : 'md:grid-cols-4'}`}>
      {products.map((product) => (
        <Link key={product.id} href={`/listing/${product.id}`}>
          <Card className="overflow-hidden rounded-none shadow-none border-none cursor-pointer h-full">
            <div className="relative">
              <Image
                src={product.product_images?.[0] || "/placeholder.svg?height=200&width=300"}
                alt={product.title || "Product image"}
                width={300}
                height={200}
                className="w-full h-[343px] object-cover"
              />
              {/* <button
                className="absolute top-2 right-2.5 bg-white/80 hover:bg-white p-2 rounded-full shadow-sm"
                onClick={(e) => {
                  e.preventDefault()
                }}
              >
                <Heart size={17} className="text-gray-600 hover:text-red-500" />
              </button> */}
            </div>

            <CardContent className="pt-[17px] px-0">
              <h1 className="text-[16px] truncate" title={product.title}>
                {capitalizeWords(product.title)}
              </h1>

              <div className="flex items-center flex-wrap gap-y-1 text-[14px] text-[#6A7282]">
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

              <div className="flex items-center justify-between mt-1.5">
                <h2 className="text-[16px]">
                  AED {product.price.toLocaleString()}
                </h2>
              </div>
            </CardContent>
          </Card>
        </Link>
      ))}
    </div>
  )
}