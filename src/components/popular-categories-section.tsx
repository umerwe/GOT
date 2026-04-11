"use client";

import React, { useState } from "react";
import { useGetCategories } from "@/hooks/useCategories";
import SkeletonLoader from "@/common/skeleton-loader";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Category } from "@/types/filters";
import NotFoundWrapper from "@/common/not-found";
import CategoryCard from "./cards/category-card";

const CategoriesSection = () => {
    const { data = [], isLoading } = useGetCategories();
    const [page, setPage] = useState(0);

    const itemsPerPage = 6;
    const totalPages = Math.ceil((data?.length || 0) / itemsPerPage);
    
    // On mobile, we usually want to show all items so they can scroll.
    // On desktop, we slice for pagination.
    const visibleCategories = data?.slice(
        page * itemsPerPage,
        (page + 1) * itemsPerPage
    );

    const paginate = (dir: number) => {
        setPage((p) => p + dir);
    };

    const isEmpty = !isLoading && (!data || data.length === 0);

    return (
        <section>
            <div className="flex items-center justify-between mt-[72px] mb-[20px]">
                <h2>Popular Categories</h2>

                {/* Hide pagination buttons on small screens since we will use native scroll */}
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
                /* MOBILE: flex, overflow-x-auto, no-scrollbar (optional)
                   DESKTOP (sm and up): grid-cols-3 to 6, overflow-visible
                */
                <div className="flex overflow-x-auto pb-4 gap-4 sm:grid sm:grid-cols-3 lg:grid-cols-6 sm:gap-[10px] sm:overflow-visible sm:pb-0 scrollbar-hide">
                    {/* For mobile, you might want to show more than just 6 items 
                       so the user can actually scroll. If you strictly only want 
                       to scroll the 6 items currently in the "page", use visibleCategories.
                    */}
                    {visibleCategories.map((category: Category) => (
                        <div key={category.id} className="min-w-[160px] sm:min-w-full">
                            <CategoryCard category={category} />
                        </div>
                    ))}
                </div>
            )}
        </section>
    );
};

export default CategoriesSection;