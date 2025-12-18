"use client";

import React, { useState } from "react";
import Image from "next/image";
import { useGetCategories } from "@/hooks/useCategories";
import Link from "next/link";
import SkeletonLoader from "@/common/skeleton-loader";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Category } from "@/types/filters";

const CategoriesSection = () => {
    const { data = [], isLoading } = useGetCategories();
    const [page, setPage] = useState(0);

    const itemsPerPage = 6;
    const totalPages = Math.ceil(data?.length / itemsPerPage);
    const visibleCategories = data?.slice(
        page * itemsPerPage,
        (page + 1) * itemsPerPage
    );

    const paginate = (dir: number) => {
        setPage((p) => p + dir);
    };

    return (
        <section className="bg-white">
            <div className="max-w-7xl mx-auto">
                <div className="flex items-center justify-between mt-10 sm:mt-0 mb-[10px]">
                    <h2 className="text-2xl text-[#000000]">Popular Categories</h2>

                    <div className="flex items-center gap-2">
                        <Button
                            variant="outline"
                            size="icon"
                            className="rounded-full"
                            onClick={() => paginate(-1)}
                            disabled={page === 0}
                        >
                            <ChevronLeft className="h-4 w-4" />
                        </Button>
                        <Button
                            variant="outline"
                            size="icon"
                            className="rounded-full"
                            onClick={() => paginate(1)}
                            disabled={page >= totalPages - 1}
                        >
                            <ChevronRight className="h-4 w-4" />
                        </Button>
                    </div>
                </div>

                {isLoading && <SkeletonLoader type="categories" count={6} />}

                {!isLoading && data && (
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4 justify-center">
                        {visibleCategories.map((category: Category) => (
                            <Link
                                href={`/ads/${category.id}`}
                                key={category.id}
                                className="flex flex-col group cursor-pointer"
                            >
                                <div className="relative w-full h-28 aspect-square rounded-none overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-200">
                                    <Image
                                        src={category.image}
                                        alt={`${category.title} category`}
                                        fill
                                        className="object-cover group-hover:scale-105 transition-transform duration-200"
                                    />
                                    <div className="absolute bottom-0 right-0 p-2 bg-dark rounded-tl-lg">
                                        <p className="text-white text-center text-xs font-semibold drop-shadow-lg leading-tight">
                                            {category?.child?.length} Items
                                        </p>
                                    </div>
                                </div>

                                <div className="mt-2 px-1">
                                    <h1 className="text-[#000000] font-semibold text-sm sm:text-base leading-tight truncate">
                                        {category.title}
                                    </h1>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        </section>
    );
};

export default CategoriesSection;