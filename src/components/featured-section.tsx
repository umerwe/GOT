"use client"

import { useState } from "react"
import { useGetFeaturedProducts } from "@/hooks/useProduct"
import ListCard from "./cards/list-card"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

export default function Features() {
    const [sortBy, setSortBy] = useState("price_low_to_high")
    const [limit, setLimit] = useState("4")

    const { data, isLoading } = useGetFeaturedProducts({
        type: "motor_bike",
        per_page: parseInt(limit),
        sort: sortBy
    })

    const featuresData = data?.data || [];

    return (
        <div className="scroll-smooth">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-[10px]">
                <h2>Featured</h2>
                <div className="flex items-center justify-start sm:justify-end gap-3 md:gap-6 flex-wrap">

                    {/* Sort By */}
                    <div className="flex items-center gap-1.5 md:gap-2">
                        <span className="text-[13px] text-[#A2A6B0] font-semibold whitespace-nowrap">Sort By:</span>
                        <Select value={sortBy} onValueChange={setSortBy}>
                            <SelectTrigger className="w-fit text-[#000000] border-none shadow-none p-0 h-auto font-semibold focus:ring-0 text-[13px]">
                                <SelectValue placeholder="Sort Order" />
                            </SelectTrigger>
                            <SelectContent align="end">
                                <SelectItem value="price_low_to_high">Price: Low to High</SelectItem>
                                <SelectItem value="price_high_to_low">Price: High to Low</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Show Limit */}
                    <div className="flex items-center gap-1.5 md:gap-2">
                        <span className="text-[13px] text-[#A2A6B0] font-semibold whitespace-nowrap">Show:</span>
                        <Select value={limit} onValueChange={setLimit}>
                            <SelectTrigger className="w-fit border-none shadow-none p-0 h-auto font-semibold focus:ring-0 text-[13px]">
                                <SelectValue placeholder="4" />
                            </SelectTrigger>
                            <SelectContent align="end">
                                <SelectItem value="4">4</SelectItem>
                                <SelectItem value="10">10</SelectItem>
                                <SelectItem value="20">20</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>
            </div>

            <ListCard
                products={featuresData}
                isLoading={isLoading}
                isFeatured={true}
            />
        </div>
    )
}