"use client"

import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { capitalizeWords } from "@/utils/capitalizeWords"
import SkeletonLoader from "@/common/skeleton-loader"
import { getConditionLabel } from "@/utils/getConditionLabel"

interface ListCardProps {
    products: Product[]
    isLoading?: boolean
    count?: number
}

export default function ListCard({
    products,
    isLoading = false,
    count
}: ListCardProps) {
    const router = useRouter()

    if (isLoading) {
        return (
            <div className="space-y-4">
                <SkeletonLoader type="product2" count={count} />
            </div>
        )
    }

    if (!products || products.length === 0) {
        return null
    }

    const displayData = count ? products.slice(0, count) : products

    return (
        <div className="px-2 mb-[60px] sm:px-4 lg:px-0 flex flex-col">
            {displayData.map((product) => (
                <div
                    key={product.id}
                    onClick={() => router.push(`/listing/${product.id}`)}
                    className="w-full  bg-white p-4 lg:pt-[21.22px] lg:pb-[41.78px] lg:px-[32px] border border-gray-200 hover:shadow-md transition-shadow cursor-pointer"
                >
                    <div className="flex flex-col lg:flex-row gap-6 lg:gap-[80px]">

                        {/* Image Section */}
                        <div className="w-full lg:w-[189px] flex-shrink-0">
                            {/* MOBILE: h-56 | DESKTOP: h-[121.34px] */}
                            <div className="relative h-56 lg:h-[122.63px] w-full overflow-hidden rounded-none">
                                <Image
                                    src={product.product_images?.[0] as string}
                                    alt={product.title || "Product image"}
                                    fill
                                    className="object-cover"
                                />
                            </div>
                        </div>

                        {/* Content Section */}
                        <div className="flex-1 flex flex-col space-y-3 lg:space-y-1 min-w-0">
                            <div className="space-y-[4px]">
                                <Link
                                    href={`/listing/${product.id}`}
                                    className="block hover:text-blue-600 transition-colors"
                                >
                                    <h1
                                        className="text-[18px] text-[#000000] truncate"
                                        title={product.title}
                                    >
                                        {capitalizeWords(product.title)}
                                    </h1>
                                </Link>

                                <h4 className="text-[14px] text-[#111111] line-clamp-3">
                                    {product.description || "No description available for this bike."}
                                </h4>
                            </div>

                            <div>
                                <h2 className="text-[16px] font-semibold lg:font-normal">
                                    AED {product.price.toLocaleString()}
                                </h2>
                            </div>
                        </div>

                        {/* Right Detail Section */}
                        <div className="w-full lg:w-[224px] flex-shrink-0 border-t border-gray-100 pt-4 lg:pt-0 lg:border-t-0 flex flex-col">
                            <div className="text-[12px] font-normal">
                                <div className="flex justify-between h-[32px] items-center px-2">
                                    <span className="text-[#000000]">Mileage</span>
                                    <span className="text-[#6A7282]">
                                        {product.mileage
                                            ? `${product.mileage.toLocaleString()} ${product.mileage_unit || "Kms"}`
                                            : "-"}
                                    </span>
                                </div>

                                <div className="flex justify-between h-[32px] items-center px-2 bg-[#FFF3DE]">
                                    <span className="text-[#000000]">Engine Size</span>
                                    <span className="text-[#6A7282]">
                                        {product.engine_size || "-"}
                                    </span>
                                </div>

                                <div className="flex justify-between h-[32px] items-center px-2">
                                    <span className="text-[#000000]">Condition</span>
                                    <span className="text-[#6A7282]">
                                        {getConditionLabel(product.condition)}
                                    </span>
                                </div>

                                <div className="flex justify-between h-[32px] px-2 bg-[#FFF3DE] items-center">
                                    <span className="text-[#000000]">Year</span>
                                    <span className="text-[#6A7282]">
                                        {product.manufacturing_year || "-"}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    )
}