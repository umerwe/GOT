"use client"

import { useGetProducts } from "@/hooks/useProduct"
import ProductCard2 from "./ads/product-card2"

export default function Features() {
    const { data, isLoading } = useGetProducts({
    })

    const featuresData: Product[] = data?.data || [];

    return (
        <div className="scroll-smooth">
            <div className="flex items-center justify-between mb-[10px]">
                <h2 className="text-2xl text-[#000000]">Featured</h2>
            </div>

            <ProductCard2
                products={featuresData}
                isLoading = {isLoading}
            />
        </div>
    )
}