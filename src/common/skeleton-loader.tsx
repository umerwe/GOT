"use client";

import React from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";


interface SkeletonLoaderProps {
    type: string;
    count?: number;
}

const SkeletonLoader = ({ type, count = 4 }: SkeletonLoaderProps) => {
    switch (type) {
        case "categories":
            return (
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
                    {Array.from({ length: count }).map((_, i) => (
                        <div key={i} className="flex flex-col items-center">
                            <Skeleton className="w-full h-36 rounded-lg" />
                        </div>
                    ))}
                </div>
            );

        case "products":
            return (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
                    {Array.from({ length: count }).map((_, i) => (
                        <Card
                            key={i}
                            className="rounded-none shadow-none border-none h-full"
                        >
                            {/* Image skeleton - Matches h-52 */}
                            <div className="relative">
                                <Skeleton className="h-52 w-full rounded-none" />
                            </div>

                            {/* Content skeleton - Matches py-4 px-0 */}
                            <CardContent className="py-4 px-0">
                                {/* Title skeleton */}
                                <Skeleton className="h-5 w-3/4 mb-2" />

                                {/* Meta data skeleton (Year | Mileage | Engine) */}
                                <div className="flex items-center gap-2 mb-3">
                                    <Skeleton className="h-4 w-12" />
                                    <span className="text-gray-200">|</span>
                                    <Skeleton className="h-4 w-16" />
                                    <span className="text-gray-200">|</span>
                                    <Skeleton className="h-4 w-12" />
                                </div>

                                {/* Price skeleton */}
                                <div className="mt-1.5">
                                    <Skeleton className="h-5 w-24" />
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            );

      case "list":
    return (
        <div className="w-full space-y-6">
            {Array.from({ length: count }).map((_, i) => (
                <div
                    key={i}
                    className="grid grid-cols-12 gap-4 items-center"
                >
                    {/* 1. Ads Column (Image + Title/Price) - Span 4 */}
                    <div className="col-span-4 flex items-center gap-4">
                        <Skeleton className="w-12 h-12 rounded-md flex-shrink-0" />
                        <div className="space-y-2 w-full max-w-[180px]">
                            <Skeleton className="h-4 w-3/4" /> {/* Title */}
                            <Skeleton className="h-3 w-1/3" /> {/* Price */}
                        </div>
                    </div>

                    {/* 2. Category Column - Span 2 */}
                    <div className="col-span-2 space-y-2">
                        <Skeleton className="h-4 w-24" /> {/* Category */}
                        <Skeleton className="h-3 w-16" /> {/* Subcategory */}
                    </div>

                    {/* 3. Status Column - Span 3 */}
                    <div className="col-span-3 flex items-center gap-2">
                        <Skeleton className="w-2 h-2 rounded-full" /> {/* Dot */}
                        <Skeleton className="h-4 w-16" /> {/* Status Text */}
                    </div>

                    {/* 4. Actions Column - Span 3 */}
                    <div className="col-span-3 flex items-center justify-end gap-2">
                        <Skeleton className="h-8 w-24 rounded-md" /> {/* Edit Button */}
                        <Skeleton className="h-8 w-8 rounded-md" />  {/* Kebab Menu */}
                    </div>
                </div>
            ))}
        </div>
    );
        case "profile":
            return (
                <div className="flex flex-col sm:flex-row items-center gap-4">
                    <Skeleton className="w-24 h-24 rounded-full" />
                    <div className="space-y-2 text-center sm:text-left">
                        <Skeleton className="h-6 w-40" />
                        <Skeleton className="h-4 w-32" />
                        <Skeleton className="h-4 w-28" />
                    </div>
                </div>
            );

        case "mylisting":
            return (
                <div className="bg-white">
                    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
                        <section className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                            {[...Array(6)].map((_, i) => (
                                <Skeleton key={i} className="aspect-[4/3] rounded-lg" />
                            ))}
                        </section>

                        <section className="space-y-2">
                            <Skeleton className="h-8 w-3/4" />
                            <Skeleton className="h-16 w-full" />
                        </section>

                        <section className="space-y-3">
                            <Skeleton className="h-6 w-40" />
                            <Skeleton className="h-32 w-full" />
                        </section>

                        <section className="space-y-2">
                            <Skeleton className="h-6 w-40" />
                            <Skeleton className="h-8 w-24" />
                            <Skeleton className="h-4 w-20" />
                        </section>

                        <section className="space-y-3">
                            <Skeleton className="h-6 w-40" />
                            <Skeleton className="h-4 w-32" />
                            <Skeleton className="h-44 w-full rounded-lg" />
                        </section>

                        <section className="space-y-3">
                            <Skeleton className="h-6 w-40" />
                            <Skeleton className="h-24 w-full" />
                        </section>
                    </div>
                </div>
            );

        case "alllisting":
            return (
                <div className="container mx-auto px-4 py-8 max-w-7xl">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* --- LEFT COLUMN: Images & Description --- */}
                        <div className="lg:col-span-2 space-y-8">

                            {/* Main Image Gallery */}
                            <div className="rounded-xl overflow-hidden">
                                <Skeleton className="w-full aspect-[4/3] lg:aspect-[16/10] bg-gray-200" />
                            </div>

                            {/* Specs Grid (Matches your border/grid layout) */}
                            <div className="border border-gray-200 rounded-lg p-6 bg-white">
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-y-6 gap-x-4">
                                    {/* Generates 8 skeleton spec boxes */}
                                    {[...Array(8)].map((_, i) => (
                                        <div key={i} className="flex flex-col gap-2">
                                            <Skeleton className="h-3 w-12" /> {/* Label */}
                                            <Skeleton className="h-5 w-20" /> {/* Value */}
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Description */}
                            <div className="space-y-4">
                                <Skeleton className="h-7 w-32" /> {/* "Overview" Title */}
                                <div className="space-y-2">
                                    <Skeleton className="h-4 w-full" />
                                    <Skeleton className="h-4 w-full" />
                                    <Skeleton className="h-4 w-3/4" />
                                </div>
                            </div>
                        </div>

                        {/* --- RIGHT COLUMN: Details & Actions --- */}
                        <div className="lg:col-span-1 space-y-6">

                            {/* Title Header */}
                            <div className="space-y-3">
                                <Skeleton className="h-8 w-3/4" /> {/* Product Title */}

                                {/* Brand/Category tags */}
                                <div className="flex gap-2">
                                    <Skeleton className="h-4 w-16" />
                                    <Skeleton className="h-4 w-16" />
                                </div>

                                {/* Location */}
                                <div className="flex gap-2 items-center pt-1">
                                    <Skeleton className="w-5 h-5 rounded-full" />
                                    <Skeleton className="h-4 w-1/2" />
                                </div>
                            </div>

                            {/* Price */}
                            <div className="border-t py-4">
                                <Skeleton className="h-9 w-1/2" />
                            </div>

                            {/* Seller Info */}
                            <div className="flex items-center justify-between -mt-2">
                                <div className="space-y-2">
                                    <Skeleton className="h-3 w-10" />
                                    <Skeleton className="h-4 w-24" />
                                </div>
                                <Skeleton className="w-10 h-10 rounded-full" />
                            </div>

                            {/* Action Buttons (Chat & Phone) */}
                            <div className="grid grid-cols-2 gap-3">
                                <Skeleton className="h-12 rounded-md" />
                                <Skeleton className="h-12 rounded-md" />
                            </div>

                            {/* Safety Note */}
                            <div className="flex items-center gap-2">
                                <Skeleton className="h-4 w-4 rounded-full" />
                                <Skeleton className="h-3 w-3/4" />
                            </div>

                            {/* Wishlist Button */}
                            <Skeleton className="h-12 w-full rounded-md" />

                        </div>
                    </div>
                </div>
            )

        case "chat":
            return (
                Array.from({ length: count }).map((_, index) => (
                    <div
                        key={index}
                        className="animate-pulse flex items-center space-x-3 p-2"
                    >
                        <div className="bg-gray-200 rounded-full w-10 h-10"></div>
                        <div className="flex-1 space-y-2">
                            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                        </div>
                    </div>
                ))
            )

        default:
            return null;
    }
};

export default SkeletonLoader;
