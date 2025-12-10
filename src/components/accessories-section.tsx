"use client";

import { useGetProducts } from '@/hooks/useProduct'
import React, { useState } from 'react'
import { Button } from '@/components/ui/button';
import ProductCard from './ads/product-card';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const AccessoriesSection = () => {
    const [page, setPage] = useState(1);

    const { data, isLoading } = useGetProducts({
        type: "accessories",
        page: page,
    });

    const motorcyclesData = data?.data || [];
    const pagination = data?.pagination;

    const handlePaginate = (dir: number) => {
        setPage((prev) => prev + dir);
        document.getElementById("motorcycles-section")?.scrollIntoView({
            behavior: "smooth",
            block: "start",
        });
    };

    return (
        <div id="motorcycles-section" className="px-2 sm:px-4 md:px-6 lg:px-8 xl:px-10 scroll-smooth">
            <div className="max-w-7xl mx-auto">
                <div className="flex items-center justify-between mb-5">
                    <h2 className="text-2xl font-semibold text-gray-900">Accessories</h2>

                    <div className="flex items-center gap-2">
                        <Button
                            variant="outline"
                            size="icon"
                            className="rounded-full"
                            onClick={() => handlePaginate(-1)}
                            disabled={page <= 1 || isLoading}
                        >
                            <ChevronLeft className="h-4 w-4" />
                        </Button>
                        <Button
                            variant="outline"
                            size="icon"
                            className="rounded-full"
                            onClick={() => handlePaginate(1)}
                            disabled={!pagination || page >= pagination.totalPages || isLoading}
                        >
                            <ChevronRight className="h-4 w-4" />
                        </Button>
                    </div>
                </div>

                <ProductCard products={motorcyclesData} isLoading={isLoading} />
            </div>
        </div>
    )
}

export default AccessoriesSection;