"use client";

import React from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import Container from "@/components/container";


interface SkeletonLoaderProps {
    type: string;
    count?: number;
    isAdsPage?: boolean;
}

const SkeletonLoader = ({ type, count = 4, isAdsPage = false }: SkeletonLoaderProps) => {
    switch (type) {
        case "categories":
            return (
                /* Matches the scrolling flex on mobile and the grid on desktop */
                <div className="flex overflow-x-auto pb-4 gap-4 sm:grid sm:grid-cols-3 lg:grid-cols-6 sm:gap-[10px] sm:overflow-visible sm:pb-0 scrollbar-hide">
                    {Array.from({ length: count }).map((_, i) => (
                        <div key={i} className="min-w-[160px] sm:min-w-full flex flex-col gap-2">
                            {/* The Image Box Skeleton */}
                            <Skeleton className="w-full h-[129px] rounded-none" />

                            {/* The Title Skeleton */}
                            <Skeleton className="h-4 w-3/4 mt-1" />
                        </div>
                    ))}
                </div>
            );

        case "products":
            return (
                /* Matches the scrolling flex on mobile and grid on desktop */
                <div className={cn(
                    "flex overflow-x-auto pb-4 gap-[10px] scrollbar-hide sm:pb-0 sm:overflow-visible sm:grid",
                    isAdsPage ? "sm:grid-cols-3" : "sm:grid-cols-6"
                )}>
                    {Array.from({ length: count }).map((_, i) => (
                        <Card
                            key={i}
                            /* min-w-[280px] ensures skeletons have the same width as actual cards on mobile */
                            className="overflow-hidden rounded-none shadow-none border-none cursor-pointer h-full min-w-[280px] sm:min-w-full"
                        >
                            <div className="relative">
                                <Skeleton className="h-[343px] w-full rounded-none" />
                            </div>

                            <CardContent className="pt-[17px] px-0">
                                {/* Title skeleton */}
                                <Skeleton className="h-5 w-3/4 mb-2" />

                                {/* Meta data skeleton */}
                                <div className="flex items-center flex-wrap gap-y-1 text-[14px]">
                                    <Skeleton className="h-4 w-12" />
                                    <span className="text-gray-200 px-1">|</span>
                                    <Skeleton className="h-4 w-16" />
                                    <span className="text-gray-200 px-1">|</span>
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
                            // Matching exact padding and border of ListCard
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
                            className="grid grid-cols-12 gap-4 p-4 items-center animate-pulse border-b border-gray-50"
                        >
                            {/* 1. Ads Column (col-span-3) */}
                            <div className="col-span-3 flex items-center gap-3">
                                <Skeleton className="w-[60px] h-[60px] bg-gray-200 flex-shrink-0 border border-gray-100" />
                                <div className="min-w-0 space-y-2">
                                    <Skeleton className="h-[14px] w-[140px] bg-gray-200" /> {/* Title */}
                                    <Skeleton className="h-[12px] w-[70px] bg-gray-100" />  {/* Price */}
                                </div>
                            </div>

                            {/* 2. Category Column (col-span-2) */}
                            <div className="col-span-2 space-y-2">
                                <Skeleton className="h-[14px] w-[100px] bg-gray-200" />
                                <Skeleton className="h-[12px] w-[60px] bg-gray-100" />
                            </div>

                            {/* 3. Ad Status Column (col-span-2) */}
                            <div className="col-span-2">
                                <div className="flex items-center gap-2">
                                    <Skeleton className="w-2 h-2 rounded-full bg-gray-200" />
                                    <Skeleton className="h-[14px] w-[60px] bg-gray-100" />
                                </div>
                            </div>

                            {/* 4. Featured Status Column (col-span-2) */}
                            <div className="col-span-2">
                                <Skeleton className="h-[14px] w-[30px] bg-gray-100" />
                            </div>

                            {/* 5. Edit Button Column (col-span-2) */}
                            <div className="col-span-2">
                                <Skeleton className="h-[32px] w-[138.97px] rounded-none bg-gray-200" />
                            </div>

                            {/* 6. More Icon Column (col-span-1) */}
                            <div className="col-span-1 flex justify-end">
                                <Skeleton className="h-8 w-8 bg-gray-100 rounded-md" />
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
                <div className="sm:pl-[23px] sm:pr-[62px]">
                    {/* Breadcrumb Skeleton - Matches mt-[27px] */}
                    <Container className="mt-[27px]">
                        <div className="flex items-center gap-2">
                            <Skeleton className="h-4 w-12" />
                            <span className="text-gray-300">/</span>
                            <Skeleton className="h-4 w-20" />
                            <span className="text-gray-300">/</span>
                            <Skeleton className="h-4 w-32" />
                        </div>
                    </Container>

                    {/* Main Listing Grid - Matches pt-[53px] */}
                    <Container className="pt-[53px] pb-[98px] sm:pl-[80px] px-0">
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-[22px]">

                            {/* --- LEFT COLUMN: Gallery & Specs --- */}
                            <div className="lg:col-span-2 space-y-[20px]">
                                {/* Main Image Gallery Skeleton - Matches aspect-[16/10] and rounded-none */}
                                <div className="relative w-full aspect-[4/3] lg:aspect-[16/10]">
                                    <Skeleton className="w-full h-full rounded-none" />
                                </div>

                                {/* Specs Grid Skeleton - Matches border-2 and p-6 */}
                                <div className="border-2 border-gray-100 rounded-none p-6 bg-white">
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-y-6 gap-x-4">
                                        {[...Array(8)].map((_, i) => (
                                            <div key={i} className="flex flex-col gap-1">
                                                <Skeleton className="h-3 w-12" /> {/* Label */}
                                                <Skeleton className="h-5 w-20" /> {/* Value */}
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Overview Section */}
                                <div className="space-y-[11px]">
                                    <Skeleton className="h-6 w-28" /> {/* "Overview" Title */}
                                    <div className="space-y-2">
                                        <Skeleton className="h-4 w-full" />
                                        <Skeleton className="h-4 w-full" />
                                        <Skeleton className="h-4 w-3/4" />
                                    </div>
                                </div>
                            </div>

                            {/* --- RIGHT COLUMN: Details & Actions --- */}
                            <div className="lg:col-span-1 space-y-[10px] sm:px-[24px]">
                                {/* Wishlist Icon */}
                                <div className="flex justify-end py-[5px]">
                                    <Skeleton className="w-8 h-8 rounded-full" />
                                </div>

                                {/* Title & Meta */}
                                <div className="space-y-[6px]">
                                    <Skeleton className="h-8 w-full" /> {/* Title */}
                                    <div className="flex gap-2">
                                        <Skeleton className="h-4 w-14" />
                                        <Skeleton className="h-4 w-10" />
                                        <Skeleton className="h-4 w-20" />
                                    </div>
                                    <div className="flex gap-1.5 pt-1">
                                        <Skeleton className="w-4 h-4" /> {/* Map Icon */}
                                        <Skeleton className="h-4 w-48" />
                                    </div>
                                </div>

                                {/* Price - Matches pt-[15px] and border-t */}
                                <div className="border-t border-gray-100 pt-[15px]">
                                    <Skeleton className="h-9 w-36" />
                                </div>

                                {/* Seller Info - Matches w-[55px] h-[50px] */}
                                <div className="flex items-center justify-between py-2">
                                    <div className="space-y-2">
                                        <Skeleton className="h-4 w-12" />
                                        <Skeleton className="h-5 w-24" />
                                    </div>
                                    <Skeleton className="w-[55px] h-[50px] rounded-none" />
                                </div>

                                {/* Action Buttons - Matches h-[54px] and rounded-none */}
                                <div className="grid grid-cols-2 gap-3">
                                    <Skeleton className="h-[54px] w-full rounded-none" />
                                    <Skeleton className="h-[54px] w-full rounded-none" />
                                </div>

                                {/* Safety Note */}
                                <div className="flex items-center gap-2 pt-2">
                                    <Skeleton className="w-4 h-4 rounded-full" />
                                    <Skeleton className="h-3 w-40" />
                                </div>

                                {/* Add to Cart (Business only placeholder) */}
                                <Skeleton className="h-[54px] w-full rounded-none border-2 border-gray-100 bg-transparent" />
                            </div>
                        </div>
                    </Container>
                </div>
            );
            return (
                <div className="sm:pl-[23px] sm:pr-[62px]">
                    {/* Breadcrumb Skeleton - Matches mt-[27px] */}
                    <Container className="mt-[27px]">
                        <div className="flex items-center gap-2">
                            <Skeleton className="h-4 w-16" />
                            <span className="text-gray-300">/</span>
                            <Skeleton className="h-4 w-24" />
                            <span className="text-gray-300">/</span>
                            <Skeleton className="h-4 w-32" />
                        </div>
                    </Container>

                    {/* Main Listing Grid - Matches pt-[53px] */}
                    <Container className="pt-[53px] pb-[98px] sm:pl-[80px] px-0">
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-[22px]">

                            {/* --- LEFT COLUMN: Gallery & Specs --- */}
                            <div className="lg:col-span-2 space-y-[20px]">
                                {/* Main Image Gallery Skeleton - Matches aspect-[16/10] */}
                                <div className="bg-gray-50 relative w-full aspect-[4/3] lg:aspect-[16/10]">
                                    <Skeleton className="w-full h-full rounded-none" />
                                </div>

                                {/* Specs Grid Skeleton - Matches 4 columns & p-6 border container */}
                                <div className="border-2 border-gray-100 rounded-none p-6 bg-white">
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-y-6 gap-x-4">
                                        {[...Array(8)].map((_, i) => (
                                            <div key={i} className="flex flex-col gap-1">
                                                <Skeleton className="h-3 w-12" /> {/* Label */}
                                                <Skeleton className="h-5 w-20" /> {/* Value */}
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Overview/Description Skeleton */}
                                <div className="space-y-[11px]">
                                    <Skeleton className="h-[22px] w-24" /> {/* "Overview" Title */}
                                    <div className="space-y-2">
                                        <Skeleton className="h-4 w-full" />
                                        <Skeleton className="h-4 w-full" />
                                        <Skeleton className="h-4 w-2/3" />
                                    </div>
                                </div>
                            </div>

                            {/* --- RIGHT COLUMN: Details & Actions --- */}
                            <div className="lg:col-span-1 space-y-[10px] sm:px-[24px]">
                                {/* Wishlist Icon Placeholder */}
                                <div className="flex justify-end py-[5px]">
                                    <Skeleton className="w-8 h-8 rounded-full" />
                                </div>

                                {/* Title Header Skeleton */}
                                <div className="space-y-[6px]">
                                    <Skeleton className="h-7 w-full" /> {/* Main Title */}
                                    <div className="flex gap-2">
                                        <Skeleton className="h-4 w-16" />
                                        <Skeleton className="h-4 w-16" />
                                        <Skeleton className="h-4 w-16" />
                                    </div>
                                    <div className="flex gap-2 pt-2">
                                        <Skeleton className="w-4 h-4" /> {/* Map Icon */}
                                        <Skeleton className="h-4 w-40" />
                                    </div>
                                </div>

                                {/* Price Skeleton */}
                                <div className="border-t border-gray-100 pt-[15px]">
                                    <Skeleton className="h-8 w-32" />
                                </div>

                                {/* Seller Info Skeleton */}
                                <div className="flex items-center justify-between py-2">
                                    <div className="space-y-1">
                                        <Skeleton className="h-4 w-12" />
                                        <Skeleton className="h-5 w-24" />
                                    </div>
                                    <Skeleton className="w-[55px] h-[50px] rounded-none" />
                                </div>

                                {/* Action Buttons Skeleton - Matches h-[54px] and grid-cols-2 */}
                                <div className="grid grid-cols-2 gap-3">
                                    <Skeleton className="h-[54px] w-full rounded-none" />
                                    <Skeleton className="h-[54px] w-full rounded-none" />
                                </div>

                                {/* Safety Note Skeleton */}
                                {/* <div className="flex items-center gap-2 pt-2">
                                    <Skeleton className="w-4 h-4 rounded-full" />
                                    <Skeleton className="h-4 w-48" />
                                </div> */}

                                {/* Add to Cart Skeleton (Optional/Business) */}
                                <Skeleton className="h-[54px] w-full rounded-none mt-2" />
                            </div>
                        </div>
                    </Container>
                </div>
            );

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
            );

        case "accessories":
            return (
                <div className="space-y-4">
                    <h2>Accessories</h2>

                    <div className="bg-[#F5F5F5]">
                        {/* Repeat for Business and Private Seller sections */}
                        {Array.from({ length: 2 }).map((_, i) => (
                            <div key={i} className="pt-[19px] px-[14px] pb-[30px] animate-pulse">

                                {/* 1. Header Skeleton (Matches Logo + Name + Address) */}
                                <div className="flex items-center gap-3 mb-[23px]">
                                    <div className="w-14 h-14 rounded-full bg-gray-200 flex-shrink-0 border-2 border-white" />
                                    <div className="space-y-2">
                                        <div className="h-5 w-40 bg-gray-200 rounded" />
                                        <div className="h-3 w-60 bg-gray-100 rounded" />
                                    </div>
                                </div>

                                {/* 2. Product Grid - Matches sm:grid-cols-6 */}
                                <div className="flex overflow-x-auto pb-4 gap-[10px] sm:pb-0 sm:overflow-visible sm:grid sm:grid-cols-6">
                                    {Array.from({ length: 6 }).map((_, j) => (
                                        <div key={j} className="min-w-[280px] sm:min-w-full">

                                            {/* Image Placeholder - Exact h-[343px] */}
                                            <div className="w-full h-[343px] bg-gray-200 rounded-none" />

                                            {/* Content Placeholder - Exact pt-[17px] */}
                                            <div className="pt-[17px] px-0">
                                                <div className="flex justify-between items-start gap-2">
                                                    <div className="flex-1 space-y-2">
                                                        {/* Title line */}
                                                        <div className="h-4 bg-gray-200 w-full rounded" />
                                                        {/* Meta info line (Year | Mileage) */}
                                                        <div className="h-3 bg-gray-100 w-2/3 rounded" />
                                                        {/* Price line */}
                                                        <div className="h-5 bg-gray-200 w-1/2 rounded mt-2" />
                                                    </div>

                                                    {/* Small Business Logo Placeholder on the right (55x50) */}
                                                    <div className="flex-shrink-0 w-[55px] h-[50px] bg-gray-100 rounded-sm" />
                                                </div>
                                            </div>

                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )

        default:
            return null;
    }
};

export default SkeletonLoader;
