"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { capitalizeWords } from "@/utils/capitalizeWords"
import SkeletonLoader from "@/common/skeleton-loader"
import { getConditionLabel } from "@/utils/getConditionLabel"
import { Heart } from "lucide-react"
import NotFoundWrapper from "@/common/not-found"
import Image from "@/components/custom/MyImage"

interface ListCardProps {
    products: Product[]
    isLoading?: boolean
    count?: number
    isHome?: boolean
}

export default function ListCard({
    products,
    isLoading = false,
    count,
    isHome = true
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
        return <NotFoundWrapper className="mt-[15px]" />
    }

    const displayData = count ? products.slice(0, count) : products

    return (
        <div className="px-2 sm:px-4 lg:px-0 flex flex-col">
            {displayData.map((product) => (
                <div
                    key={product.id}
                    onClick={() => router.push(`/listing/${product.id}`)}
                    className="w-full  bg-white p-4 lg:pt-[21.22px] lg:pb-[41.78px] lg:px-[32px] border border-gray-200 hover:shadow-md transition-shadow cursor-pointer"
                >
                    <div className={`flex flex-col lg:flex-row gap-6 ${isHome ? "lg:gap-[80px]" : "lg:gap-[18px]"}`}>

                        {/* Image Section */}
                        <div className="w-full lg:w-[189px] flex-shrink-0">
                            <div className="relative h-56 lg:h-[122.63px] w-full overflow-hidden rounded-none">
                                <Image
                                    src={product.product_images?.[0] || ""}
                                    alt={product.title || "Product"}
                                    fill
                                    className="object-cover"
                                />
                            </div>
                        </div>

                        {/* Content Section */}
                        <div className="flex-1 flex justify-between md:justify-start space-y-3 gap-[20px] lg:space-y-1 min-w-0 relative">
                            <div className={`space-y-[4px] ${isHome ? "max-w-[538px]" : "w-full"}`}>
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
                                <h2 className="text-[16px] font-semibold lg:font-normal mt-[4px]">
                                    AED {product.price.toLocaleString()}
                                </h2>
                            </div>



                            {(isHome && product.brand?.image) && (
                                <div className="flex-shrink-0 mt-[67px] w-[55px] h-[50px]">
                                    <Image
                                        src={product.brand.image}
                                        alt={product.brand.title || "Brand"}
                                        width={55}
                                        height={50}
                                        wrapperClassName="w-full h-full bg-white"
                                        className="object-cover w-full h-full"
                                        disableLoader={true}
                                    />
                                </div>
                            )}


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

                        <div className="relative">
                            {
                                isHome &&
                                <div className="flex items-center gap-1.5 text-[10px] text-[#78A962]">
                                    <div className="bg-[#78A962] rounded-full w-[14px] h-[14px] flex items-center justify-center">
                                        <svg
                                            width="10"
                                            height="10"
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth="2"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            className="text-white"
                                        >
                                            <polyline points="20 6 9 17 4 12" />
                                        </svg>
                                    </div>
                                    <span>Verified</span>
                                    <button className="flex items-center gap-[10px] group absolute -bottom-2 right-0">
                                        <div className="w-8 h-8 rounded-full border-2 border-gray-400 flex items-center justify-center text-gray-400 group-hover:border-gray-500 group-hover:text-gray-500 transition-all">
                                            <Heart size={17} className="stroke-3" />
                                        </div>
                                    </button>
                                </div>

                            }
                        </div>
                        {
                            !isHome &&
                            <button className="flex items-baseline-last gap-[10px] group">
                                <div className="w-8 h-8 rounded-full border-2 border-gray-400 flex items-center justify-center text-gray-400 group-hover:border-gray-500 group-hover:text-gray-500 transition-all">
                                    <Heart size={17} className="stroke-3" />
                                </div>
                            </button>
                        }
                    </div>
                </div>
            ))}
        </div>
    )
}