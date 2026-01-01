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

        case "product2":
            return (
                <div className="px-2 mb-[60px] border border-gray-200 sm:px-4 lg:px-0 flex flex-col">
                    {Array.from({ length: count }).map((_, index) => (
                        <div
                            key={index}
                            // Matching exact padding and border of ProductCard2
                            className="w-full bg-white pt-[21.22px] pb-[46.15px] px-[32px] border border-gray-200 animate-pulse"
                        >
                            {/* Matching gap-[80px] used in the actual component */}
                            <div className="flex flex-col lg:flex-row gap-[80px]">

                                {/* Image Section Skeleton - Exact Widths */}
                                <div className="w-full lg:w-[189px] flex-shrink-0">
                                    <div className="relative h-48 lg:h-[121.34px] w-full bg-gray-200 rounded-sm" />
                                </div>

                                {/* Content Section Skeleton - Matching space-y-1 */}
                                <div className="flex-1 flex flex-col space-y-1 min-w-0">
                                    <div className="space-y-[10px]">
                                        {/* Title Line */}
                                        <div className="h-6 bg-gray-200 rounded w-3/4" />
                                        {/* Description Lines - Matching text height/spacing */}
                                        <div className="space-y-2 mt-2">
                                            <div className="h-4 bg-gray-200 rounded w-full" />
                                            <div className="h-4 bg-gray-200 rounded w-5/6" />
                                        </div>
                                    </div>

                                    {/* Price Line */}
                                    <div className="mt-4">
                                        <div className="h-6 bg-gray-200 rounded w-24" />
                                    </div>
                                </div>

                                {/* Right Detail Section Skeleton - Width 224px */}
                                <div className="w-full lg:w-[224px] flex-shrink-0 border-t lg:border-t-0 flex flex-col">
                                    <div className="space-y-1">
                                        {/* Mileage Row */}
                                        <div className="flex justify-between h-[32px] items-center px-2">
                                            <div className="h-3 bg-gray-200 rounded w-12" />
                                            <div className="h-3 bg-gray-200 rounded w-16" />
                                        </div>

                                        {/* Engine Size Row (Shaded) */}
                                        <div className="flex justify-between h-[32px] items-center px-2 bg-gray-50 rounded">
                                            <div className="h-3 bg-gray-200 rounded w-16" />
                                            <div className="h-3 bg-gray-200 rounded w-8" />
                                        </div>

                                        {/* Condition Row */}
                                        <div className="flex justify-between h-[32px] items-center px-2">
                                            <div className="h-3 bg-gray-200 rounded w-14" />
                                            <div className="h-3 bg-gray-200 rounded w-12" />
                                        </div>

                                        {/* Year Row (Shaded) */}
                                        <div className="flex justify-between h-[32px] items-center px-2 bg-gray-50 rounded">
                                            <div className="h-3 bg-gray-200 rounded w-10" />
                                            <div className="h-3 bg-gray-200 rounded w-12" />
                                        </div>
                                    </div>
                                </div>

                            </div>
                        </div>
                    ))}
                </div>
            )
       case "list":
    return (
        <>
            {Array.from({ length: count }).map((_, i) => (
                <div
                    key={i}
                    className="grid grid-cols-1 sm:grid-cols-12 gap-4 p-4 items-center animate-pulse"
                >
                    {/* 1. Ads Column (Matches your first column exactly) */}
                    <div className="col-span-1 sm:col-span-4 flex items-start sm:items-center gap-3">
                        <Skeleton className="w-[60px] h-[60px] bg-gray-200 flex-shrink-0 rounded-none border border-gray-100" />
                        <div className="min-w-0 space-y-1">
                            <Skeleton className="h-[24px] w-[180px] bg-gray-200" /> {/* Title */}
                            <Skeleton className="h-[20px] w-[80px] bg-gray-100" />  {/* Price */}
                        </div>
                    </div>

                    {/* 2. Category Column (Matches pl-16 and -mt-2) */}
                    <div className="col-span-1 sm:col-span-2 pl-16 sm:pl-0 -mt-2 sm:mt-0 space-y-1">
                        <Skeleton className="h-[20px] w-[100px] bg-gray-200" />
                        <Skeleton className="h-[20px] w-[60px] bg-gray-100" />
                    </div>

                    {/* 3. Ad Status Column */}
                    <div className="col-span-1 sm:col-span-2 pl-16 sm:pl-0 -mt-2 sm:mt-0">
                        <div className="flex items-center gap-2">
                            <Skeleton className="w-2 h-2 rounded-full bg-gray-200" />
                            <Skeleton className="h-[20px] w-[60px] bg-gray-100" />
                        </div>
                    </div>

                    {/* 4. Actions Column (Matches Button width w-[138.96px]) */}
                    <div className="col-span-1 sm:col-span-2 flex items-center gap-2">
                        <Skeleton className="h-[32px] w-[138.96px] rounded-none bg-gray-200" />
                    </div>

                    {/* 5. More Icon Column */}
                    <div className="col-span-1 sm:col-span-2 flex items-center justify-end">
                        <Skeleton className="h-8 w-8 bg-gray-100 rounded-none" />
                    </div>
                </div>
            ))}
        </>
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
                <div className="pl-[23px] pr-[62px] w-full">
                    {/* Breadcrumb Placeholder */}
                    <div className="mt-[27px]">
                        <Skeleton className="h-4 w-64 rounded-sm" />
                    </div>

                    {/* Main Content Container - Matches pt-[53px] and pl-[80px] from ListingById */}
                    <div className="pt-[53px] pb-[98px] lg:pl-[80px] px-0">
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-[22px]">

                            {/* --- LEFT COLUMN: Images & Description --- */}
                            <div className="lg:col-span-2 space-y-[20px]">

                                {/* Main Image Gallery - matches rounded-none and aspect ratios */}
                                <div className="bg-gray-50 rounded-none overflow-hidden relative">
                                    <Skeleton className="w-full aspect-[4/3] lg:aspect-[16/10] rounded-none" />
                                </div>

                                {/* Specs Grid - matches border-2, rounded-none, and grid layout */}
                                <div className="border-2 border-gray-200 rounded-none p-6 bg-white">
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-y-6 gap-x-4">
                                        {[...Array(8)].map((_, i) => (
                                            <div key={i} className="flex flex-col gap-1">
                                                <Skeleton className="h-3 w-16" /> {/* Label */}
                                                <Skeleton className="h-5 w-24" /> {/* Value */}
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Description - matches space-y-[11px] */}
                                <div className="space-y-[11px]">
                                    <Skeleton className="h-6 w-32" /> {/* Title "Overview" */}
                                    <div className="space-y-2">
                                        <Skeleton className="h-4 w-full" />
                                        <Skeleton className="h-4 w-full" />
                                        <Skeleton className="h-4 w-4/5" />
                                    </div>
                                </div>
                            </div>

                            {/* --- RIGHT COLUMN: Details & Actions --- */}
                            <div className="lg:col-span-1 space-y-[10px] px-[24px]">

                                {/* Title Header */}
                                <div className="space-y-[10px]">
                                    {/* Product Title - width matches your 199px limit */}
                                    <Skeleton className="h-6 w-[199px]" />
                                    <Skeleton className="h-6 w-[150px]" />

                                    {/* Brand/Category dots */}
                                    <div className="flex gap-2 pt-1">
                                        <Skeleton className="h-4 w-16" />
                                        <Skeleton className="h-4 w-16" />
                                    </div>

                                    {/* Location */}
                                    <div className="flex gap-2 items-center pt-1">
                                        <Skeleton className="w-5 h-5 rounded-full" />
                                        <Skeleton className="h-4 w-40" />
                                    </div>
                                </div>

                                {/* Price - matches border-t and pt-[10px] */}
                                <div className="border-t pt-[10px]">
                                    <Skeleton className="h-7 w-32" />
                                </div>

                                {/* Seller Info */}
                                <div className="flex items-center justify-between py-2">
                                    <div className="flex gap-2 items-center">
                                        <Skeleton className="h-4 w-10" /> {/* "Seller" */}
                                        <Skeleton className="h-4 w-24" /> {/* Name */}
                                    </div>
                                </div>

                                {/* Action Buttons - matches rounded-none and h-12 */}
                                <div className="grid grid-cols-2 gap-3">
                                    <Skeleton className="h-12 rounded-none" />
                                    <Skeleton className="h-12 rounded-none" />
                                </div>

                                {/* Safety Note */}
                                <div className="flex items-center gap-2 border-b pb-[10px] mt-2">
                                    <Skeleton className="h-4 w-4 rounded-full" />
                                    <Skeleton className="h-3 w-40" />
                                </div>

                                {/* Wishlist Button - matches rounded-none and h-12 */}
                                <Skeleton className="h-12 w-full rounded-none" />
                            </div>

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
