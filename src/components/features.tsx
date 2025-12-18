"use client"

import { useState, useMemo } from "react"
import { useGetProducts } from "@/hooks/useProduct"
import ProductCard2 from "./ads/product-card2"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

export default function Features() {
    const [sortBy, setSortBy] = useState("newest")
    const [limit, setLimit] = useState("4")

    const { data, isLoading } = useGetProducts({})
    const featuresData = data?.data || [];

    const processedProducts = useMemo(() => {
        let result = [...featuresData];

        result.sort((a, b) => {
            if (sortBy === "newest") {
                return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
            }
            if (sortBy === "oldest") {
                return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
            }
            if (sortBy === "price_low") {
                return a.price - b.price;
            }
            if (sortBy === "price_high") {
                return b.price - a.price;
            }
            return 0;
        });

        return result.slice(0, parseInt(limit));
    }, [featuresData, sortBy, limit]);

    return (
        <div className="scroll-smooth">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-[10px]">
                <h2 className="text-xl md:text-2xl font-bold text-[#000000]">Featured</h2>
                <div className="flex items-center justify-start sm:justify-end gap-3 md:gap-6 flex-wrap">
                    
                    {/* Sort By */}
                    <div className="flex items-center gap-1.5 md:gap-2">
                        <span className="text-xs md:text-sm text-gray-400 whitespace-nowrap">Sort By:</span>
                        <Select value={sortBy} onValueChange={setSortBy}>
                            <SelectTrigger className="w-fit border-none shadow-none p-0 h-auto font-semibold focus:ring-0 text-sm md:text-base">
                                <SelectValue placeholder="Date published" />
                            </SelectTrigger>
                            <SelectContent align="end">
                                <SelectItem value="price_low">Price: Low to High</SelectItem>
                                <SelectItem value="price_high">Price: High to Low</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Show Limit */}
                    <div className="flex items-center gap-1.5 md:gap-2">
                        <span className="text-xs md:text-sm text-gray-400 whitespace-nowrap">Show:</span>
                        <Select value={limit} onValueChange={setLimit}>
                            <SelectTrigger className="w-fit border-none shadow-none p-0 h-auto font-semibold focus:ring-0 text-sm md:text-base">
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

            <ProductCard2
                products={processedProducts}
                isLoading={isLoading}
            />
        </div>
    )
}