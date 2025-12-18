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
                <div className="max-w-7xl mx-auto px-2 border border-gray-200 sm:px-4 lg:px-0 flex flex-col">
                    {Array.from({ length: count }).map((_, index) => (
                        <div
                            key={index}
                            className="w-full bg-white p-2 border border-gray-200 animate-pulse"
                        >
                            <div className="flex flex-col lg:flex-row gap-4">

                                {/* Image Section Skeleton */}
                                <div className="w-full lg:w-[189px] flex-shrink-0">
                                    <div className="relative h-48 lg:h-[123px] w-full bg-gray-200 rounded-sm" />
                                </div>

                                {/* Content Section Skeleton */}
                                <div className="flex-1 flex flex-col space-y-1 min-w-0 justify-between mt-2">
                                    <div className="space-y-2">
                                        {/* Title Line */}
                                        <div className="h-6 bg-gray-200 rounded w-3/4" />

                                        {/* Description Lines */}
                                        <div className="space-y-1 mt-2">
                                            <div className="h-4 bg-gray-200 rounded w-full" />
                                            <div className="h-4 bg-gray-200 rounded w-5/6" />
                                        </div>
                                    </div>

                                    {/* Price Line */}
                                    <div className="mt-2">
                                        <div className="h-5 bg-gray-200 rounded w-1/4" />
                                    </div>
                                </div>

                                {/* Right Detail Section Skeleton */}
                                <div className="w-full lg:w-[270px] flex-shrink-0 border-t lg:border-t-0  pt-4 lg:pl-5 flex flex-col justify-center gap-1">
                                    {/* Row 1 */}
                                    <div className="flex justify-between py-1 px-2">
                                        <div className="h-3 bg-gray-200 rounded w-12" />
                                        <div className="h-3 bg-gray-200 rounded w-16" />
                                    </div>

                                    {/* Row 2 (Simulating the bg-[#FFF6E5] row spacing) */}
                                    <div className="flex justify-between py-1 px-2 rounded">
                                        <div className="h-3 bg-gray-200 rounded w-16" />
                                        <div className="h-3 bg-gray-200 rounded w-8" />
                                    </div>

                                    {/* Row 3 */}
                                    <div className="flex justify-between py-1 px-2">
                                        <div className="h-3 bg-gray-200 rounded w-14" />
                                        <div className="h-3 bg-gray-200 rounded w-12" />
                                    </div>

                                    {/* Row 4 */}
                                    <div className="flex justify-between py-1 px-2 rounded">
                                        <div className="h-3 bg-gray-200 rounded w-10" />
                                        <div className="h-3 bg-gray-200 rounded w-12" />
                                    </div>
                                </div>

                            </div>
                        </div>
                    ))}
                </div>
            )
        case "list":
            return (
                <div className="w-full space-y-4 md:space-y-6">
                    {Array.from({ length: count }).map((_, i) => (
                        <div
                            key={i}
                            className="flex flex-col gap-4 p-4 border rounded-xl bg-white 
                     md:grid md:grid-cols-12 md:gap-4 md:items-center md:p-0 md:border-none md:bg-transparent"
                        >
                            {/* 1. Ads Column (Image + Title/Price) */}
                            <div className="flex items-center gap-4 col-span-12 md:col-span-4">
                                <Skeleton className="w-16 h-16 md:w-12 md:h-12 rounded-lg flex-shrink-0" />
                                <div className="space-y-2 w-full">
                                    <Skeleton className="h-4 w-3/4 md:w-full" /> {/* Title */}
                                    <Skeleton className="h-3 w-1/4 md:w-1/3" /> {/* Price */}
                                </div>
                            </div>

                            {/* Mobile Divider (Optional, only shows on small screens) */}
                            <div className="h-px bg-gray-100 w-full md:hidden" />

                            <div className="grid grid-cols-2 md:contents">
                                {/* 2. Category Column */}
                                <div className="col-span-1 md:col-span-2 space-y-2">
                                    <Skeleton className="h-4 w-20 md:w-24" /> {/* Category */}
                                    <Skeleton className="h-3 w-12 md:w-16" /> {/* Subcategory */}
                                </div>

                                {/* 3. Status Column */}
                                <div className="col-span-1 md:col-span-3 flex items-center gap-2 md:justify-start justify-end">
                                    <Skeleton className="w-2 h-2 rounded-full" /> {/* Dot */}
                                    <Skeleton className="h-4 w-16" /> {/* Status Text */}
                                </div>
                            </div>

                            {/* 4. Actions Column */}
                            <div className="col-span-12 md:col-span-3 flex items-center justify-between md:justify-end gap-2 pt-2 md:pt-0">
                                <Skeleton className="h-9 w-full md:w-24 rounded-md" /> {/* Edit Button (Full width on mobile) */}
                                <Skeleton className="h-9 w-9 rounded-md flex-shrink-0" /> {/* Kebab Menu */}
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
                <div className="w-full">
                    {/* Breadcrumb Placeholder (matches ListingById container) */}
                    <div className="max-w-[1400px] mx-auto px-3 mt-4">
                        <Skeleton className="h-4 w-64 rounded-sm" />
                    </div>

                    {/* Main Content Container (matches ListingById container) */}
                    <div className="max-w-7xl mx-auto px-3 pt-10 pb-16">
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                            {/* --- LEFT COLUMN: Images & Description --- */}
                            <div className="lg:col-span-2 space-y-8">

                                {/* Main Image Gallery - rounded-none to match actual image */}
                                <div className="bg-gray-50 rounded-none overflow-hidden relative">
                                    <Skeleton className="w-full aspect-[4/3] lg:aspect-[16/10] rounded-none bg-gray-200" />
                                </div>

                                {/* Specs Grid - border-2 and rounded-none to match actual specs */}
                                <div className="border-2 border-gray-200 rounded-none p-6 bg-white">
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-y-6 gap-x-4">
                                        {[...Array(8)].map((_, i) => (
                                            <div key={i} className="flex flex-col gap-1">
                                                <Skeleton className="h-3 w-16 mb-1" /> {/* Label */}
                                                <Skeleton className="h-4 w-24" />      {/* Value */}
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Description */}
                                <div className="space-y-2">
                                    <Skeleton className="h-6 w-32 mb-2" /> {/* Title "Overview" */}
                                    <div className="space-y-1.5">
                                        <Skeleton className="h-4 w-full" />
                                        <Skeleton className="h-4 w-full" />
                                        <Skeleton className="h-4 w-11/12" />
                                        <Skeleton className="h-4 w-4/5" />
                                    </div>
                                </div>
                            </div>

                            {/* --- RIGHT COLUMN: Details & Actions --- */}
                            <div className="lg:col-span-1 space-y-4">

                                {/* Title Header */}
                                <div className="space-y-2">
                                    {/* Product Title */}
                                    <Skeleton className="h-8 w-11/12" />
                                    <Skeleton className="h-8 w-3/4" />

                                    {/* Brand/Category tags */}
                                    <div className="flex gap-2 pt-1">
                                        <Skeleton className="h-4 w-20" />
                                        <Skeleton className="h-4 w-20" />
                                    </div>

                                    {/* Location */}
                                    <div className="flex gap-2 items-center pt-1">
                                        <Skeleton className="w-5 h-5 rounded-full" />
                                        <Skeleton className="h-4 w-40" />
                                    </div>
                                </div>

                                {/* Price */}
                                <div className="border-t py-4">
                                    <Skeleton className="h-7 w-48" />
                                </div>

                                {/* Seller Info */}
                                <div className="flex items-center justify-between -mt-4">
                                    <div className="flex gap-2 items-center">
                                        <Skeleton className="h-4 w-12" /> {/* "Seller" */}
                                        <Skeleton className="h-4 w-24" /> {/* Name */}
                                    </div>
                                    {/* Image is commented out in your original code, but if needed: */}
                                    {/* <Skeleton className="w-10 h-10 rounded-full" /> */}
                                </div>

                                {/* Action Buttons - rounded-md to match your buttons */}
                                <div className="grid grid-cols-2 gap-3">
                                    <Skeleton className="h-12 rounded-md bg-gray-200" />
                                    <Skeleton className="h-12 rounded-md bg-gray-200" />
                                </div>

                                {/* Safety Note */}
                                <div className="flex items-center gap-2 mt-2">
                                    <Skeleton className="h-4 w-4 rounded-full" />
                                    <Skeleton className="h-3 w-56" />
                                </div>

                                {/* Wishlist Button */}
                                <Skeleton className="h-12 w-full rounded-md mt-2" />
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
