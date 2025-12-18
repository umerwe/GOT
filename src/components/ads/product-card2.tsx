"use client"

import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Heart } from "lucide-react"
import { capitalizeWords } from "@/utils/capitalizeWords"
import SkeletonLoader from "@/common/skeleton-loader"

interface ProductCardProps {
    products: Product[]
    isLoading?: boolean
    count?: number
}

export default function ProductCard2({
    products,
    isLoading = false,
    count
}: ProductCardProps) {
    const router = useRouter()

    const getConditionLabel = (cond: number | string | undefined) => {
        if (!cond) return "N/A"
        if (typeof cond === "string") return cond
        if (cond >= 9) return "New"
        if (cond >= 8) return "Excellent"
        if (cond >= 6) return "Good"
        return "Fair"
    }

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
        <div className="max-w-7xl mx-auto px-2 border border-gray-200 sm:px-4 lg:px-0 flex flex-col">
            {displayData.map((product) => (
                <div
                    key={product.id}
                    onClick={() => router.push(`/listing/${product.id}`)}
                    className="w-full bg-white p-2 border border-gray-200 hover:shadow-md transition-shadow cursor-pointer"
                >
                    <div className="flex flex-col lg:flex-row gap-4">
                        {/* Image Section */}
                        <div className="w-full lg:w-[189px] flex-shrink-0">
                            <div className="relative h-48 lg:h-[123px] w-full overflow-hidden">
                                <Image
                                    src={product.product_images?.[0] as string}
                                    alt={product.title || "Product image"}
                                    width={300}
                                    height={200}
                                    className="w-full h-full object-cover"
                                />
                                <button
                                    className="absolute top-2 right-2.5 bg-white/80 hover:bg-white p-2 rounded-full shadow-sm z-10"
                                    onClick={(e) => {
                                        e.stopPropagation()
                                        e.preventDefault()
                                    }}
                                >
                                    <Heart size={17} className="text-gray-600 hover:text-red-500" />
                                </button>
                            </div>
                        </div>

                        {/* Content Section */}
                        <div className="flex-1 flex flex-col space-y-1 min-w-0 mt-2">
                            <div className="space-y-2">
                                <Link
                                    href={`/listing/${product.id}`}
                                    className="block hover:text-blue-600 transition-colors"
                                >
                                    <h1
                                        className="text-lg font-semibold text-[#000000] truncate"
                                        title={product.title}
                                    >
                                        {capitalizeWords(product.title)}
                                    </h1>
                                </Link>

                                <p className="text-sm text-gray-600 leading-relaxed line-clamp-2">
                                    {product.description || "No description available for this bike."}
                                </p>
                            </div>

                            <div>
                                <h2 className="text-base font-medium text-[#000000]">
                                    AED {product.price.toLocaleString()}
                                </h2>
                            </div>
                        </div>

                        {/* Right Detail Section */}
                        <div className="w-full lg:w-[270px] flex-shrink-0 border-t lg:border-t-0 pt-4 lg:pt-2 lg:pl-5 flex flex-col">
                            <div className="space-y-1 text-xs">
                                <div className="flex justify-between py-1 px-2">
                                    <span className="text-[#000000]">Mileage</span>
                                    <span className="text-gray-500">
                                        {product.mileage
                                            ? `${product.mileage.toLocaleString()} ${product.mileage_unit || "Kms"}`
                                            : "-"}
                                    </span>
                                </div>

                                <div className="flex justify-between py-1 px-2 bg-[#FFF6E5] rounded">
                                    <span className="text-[#000000]">Engine Size</span>
                                    <span className="text-gray-500">
                                        {product.engine_size || "-"}
                                    </span>
                                </div>

                                <div className="flex justify-between py-1 px-2">
                                    <span className="text-[#000000]">Condition</span>
                                    <span className="text-gray-500">
                                        {getConditionLabel(product.condition)}
                                    </span>
                                </div>

                                <div className="flex justify-between py-1 px-2 bg-[#FFF6E5] rounded">
                                    <span className="text-[#000000]">Year</span>
                                    <span className="text-gray-500">
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