"use client";

import React, { useState } from "react";
import Image from "@/components/custom/MyImage";
import { useGetCategories } from "@/hooks/useCategories";
import Link from "next/link";
import SkeletonLoader from "@/common/skeleton-loader";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Category } from "@/types/filters";
import NotFoundWrapper from "@/common/not-found";

const CategoriesSection = () => {
    const { data = [], isLoading } = useGetCategories();
    const [page, setPage] = useState(0);

    const itemsPerPage = 6;
    const totalPages = Math.ceil((data?.length || 0) / itemsPerPage);
    const visibleCategories = data?.slice(
        page * itemsPerPage,
        (page + 1) * itemsPerPage
    );

    const paginate = (dir: number) => {
        setPage((p) => p + dir);
    };

    // Determine if we should show the empty state
    const isEmpty = !isLoading && (!data || data.length === 0);

    return (
        <section>
            <div className="flex items-center justify-between mt-[72px] mb-[20px]">
                <h2>Popular Categories</h2>
                
                {!isLoading && data.length > 0 && (
                    <div className="flex items-center gap-2">
                        <Button
                            variant="outline"
                            size="icon"
                            className="rounded-full h-8 w-8"
                            onClick={() => paginate(-1)}
                            disabled={page === 0}
                        >
                            <ChevronLeft className="h-4 w-4" />
                        </Button>
                        <Button
                            variant="outline"
                            size="icon"
                            className="rounded-full h-8 w-8"
                            onClick={() => paginate(1)}
                            disabled={page >= totalPages - 1}
                        >
                            <ChevronRight className="h-4 w-4" />
                        </Button>
                    </div>
                )}
            </div>

            {isLoading ? (
                <SkeletonLoader type="categories" count={6} />
            ) : isEmpty ? (
                <NotFoundWrapper />
            ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-[10px] justify-center">
                    {visibleCategories.map((category: Category) => (
                        <Link
                            href={`/ads/${category.id}`}
                            key={category.id}
                            className="flex flex-col group cursor-pointer"
                        >
                            <div className="relative w-full h-[129px] aspect-square overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-200">
                                <Image
                                    src={category.image}
                                    alt={`${category.title} category`}
                                    fill
                                    className="object-cover group-hover:scale-105 transition-transform duration-200"
                                />
                                <div className="absolute bottom-0 right-0 p-2 bg-[#E9A426]">
                                    <p className="text-black text-center text-[13px] font-medium leading-tight">
                                        {category?.child?.length || 0} Items
                                    </p>
                                </div>
                            </div>

                            <div className="mt-2 px-1">
                                <h1 className="text-[#000000] font-semibold text-[12px] sm:text-base leading-tight truncate">
                                    {category.title}
                                </h1>
                            </div>
                        </Link>
                    ))}
                </div>
            )}
        </section>
    );
};

export default CategoriesSection;