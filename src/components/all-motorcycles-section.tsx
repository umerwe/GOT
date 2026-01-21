"use client";

import { useGetProducts } from '@/hooks/useProduct'
import React, { useState } from 'react'
import { Button } from '@/components/ui/button';
import ProductCard from './ads/product-card';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const AllMotorcyclesSection = () => {
    const [page, setPage] = useState(1);

    const { data, isLoading } = useGetProducts({
        type: "motor_bike",
        page: page,
        per_page: 4
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
        <div className="scroll-smooth">
                <div className="flex items-center justify-between mb-[10px]">
                    <h2>All Motorcycles</h2>

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
    )
}

export default AllMotorcyclesSection