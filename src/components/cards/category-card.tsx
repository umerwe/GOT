"use client"

import React from "react";
import Image from "@/components/custom/MyImage";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Category } from "@/types/filters";

const CategoryCard = ({ category }: { category: Category }) => {
    return (
        <Link
            href={`/categories/${category.id}`}
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
                <Button
                    variant="primary"
                    className="absolute bottom-0 right-0 p-2 text-[13px] font-medium"
                >
                    {category.total_items || 0} Items
                </Button>
            </div>

            <div className="mt-2 px-1">
                <h1 className="text-[#000000] font-semibold text-base leading-tight truncate">
                    {category.title}
                </h1>
            </div>
        </Link>
    )
}

export default CategoryCard