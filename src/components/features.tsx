"use client"

import Image from "next/image"
import Link from "next/link"
import { capitalizeWords } from "@/utils/capitalizeWords"
import { useGetProducts } from "@/hooks/useProduct"
import SkeletonLoader from "@/common/skeleton-loader"
import { Heart } from "lucide-react"
import { useRouter } from "next/navigation"

export default function Features() {
    const router = useRouter();
    const { data, isLoading } = useGetProducts({
    })

    const featuresData: Product[] = data?.data || []

    const getConditionLabel = (cond: number | string | undefined) => {
        if (!cond) return "N/A"
        if (typeof cond === "string") return cond
        if (cond >= 9) return "New"
        if (cond >= 8) return "Excellent"
        if (cond >= 6) return "Good"
        if (cond >= 6) return "Good"
        return "Fair"
    }

    if (isLoading) {
        return (
            <div className="space-y-4">
                <SkeletonLoader count={3} type="products" />
            </div>
        )
    }

    if (!featuresData || featuresData.length === 0) {
        return null
    }

    return (
        <div id="motorcycles-section" className="px-2 sm:px-4 md:px-6 lg:px-8 xl:px-10 scroll-smooth">
            <div className="max-w-7xl mx-auto">
                <div className="flex items-center justify-between mb-5">
                    <h2 className="text-2xl text-gray-900">Featured</h2>
                </div>

                <div className="max-w-7xl mx-auto px-2 border border-gray-200 sm:px-4 lg:px-0 flex flex-col">
                    {featuresData.map((product) => (
                        <div
                            key={product.id}
                            onClick={() => router.push(`/listing/${product.id}`)}
                            className="w-full bg-white p-3.5 border border-gray-200 hover:shadow-md transition-shadow cursor-pointer"
                        >
                            <div className="flex flex-col lg:flex-row gap-4">

                                {/* Image Section - Adjusted size and fit */}
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
                                                e.stopPropagation(); // Prevent card click when clicking heart
                                                e.preventDefault();
                                            }}
                                        >
                                            <Heart size={17} className="text-gray-600 hover:text-red-500" />
                                        </button>
                                    </div>
                                </div>

                                {/* Content Section - Added space-y-4 and removed extra margins */}
                                <div className="flex-1 flex flex-col space-y-1 min-w-0">
                                    <div className="space-y-2">
                                        <Link href={`/listing/${product.id}`} className="block hover:text-blue-600 transition-colors">
                                            <h1 className="text-lg font-semibold text-gray-900 truncate" title={product.title}>
                                                {capitalizeWords(product.title)}
                                            </h1>
                                        </Link>

                                        {/* Description with line clamp and no bottom margin */}
                                        <p className="text-sm text-gray-600 leading-relaxed line-clamp-2">
                                            {product.description || "No description available for this bike."}
                                        </p>
                                    </div>

                                    <div>
                                        <h2 className="text-base font-medium text-gray-900">
                                            AED {product.price.toLocaleString()}
                                        </h2>
                                    </div>
                                </div>

                                {/* Right Detail Section */}
                                <div className="w-full lg:w-[270px] flex-shrink-0 border-t lg:border-t-0 lg:border-l border-gray-100 pt-4 lg:pt-0 lg:pl-5 flex flex-col">
                                    <div className="space-y-1 text-xs">
                                        <div className="flex justify-between py-1 px-2">
                                            <span className="text-gray-900">Mileage</span>
                                            <span className="text-gray-500">
                                                {product.mileage ? `${product.mileage.toLocaleString()} ${product.mileage_unit || 'Kms'}` : "-"}
                                            </span>
                                        </div>

                                        <div className="flex justify-between py-1 px-2 bg-[#FFF6E5] rounded">
                                            <span className="text-gray-900">Engine Size</span>
                                            <span className="text-gray-500">
                                                {product.engine_size || "-"}
                                            </span>
                                        </div>

                                        <div className="flex justify-between py-1 px-2">
                                            <span className="text-gray-900">Condition</span>
                                            <span className="text-gray-500">
                                                {getConditionLabel(product.condition)}
                                            </span>
                                        </div>

                                        <div className="flex justify-between py-1 px-2 bg-[#FFF6E5] rounded">
                                            <span className="text-gray-900">Year</span>
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
            </div>
        </div>
    )
}