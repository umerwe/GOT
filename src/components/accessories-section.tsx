"use client";

import { useGetVendorProducts } from '@/hooks/useProduct'
import React, { useState } from 'react'
import { Button } from '@/components/ui/button';
import GridCard from './cards/grid-card';
import { ChevronLeft, ChevronRight, Star } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { Vendor } from '@/types/vendor';

const AccessoriesSection = () => {
    const { data: vendorData, isLoading: vendorLoading } = useGetVendorProducts();

    const [paginationMap, setPaginationMap] = useState<Record<number | string, number>>({});

    if (vendorLoading) return <div className="py-10 text-center">Loading Accessories...</div>;

    const handleScroll = (vendorId: number | string, direction: 'next' | 'prev', totalProducts: number) => {
        const currentIndex = paginationMap[vendorId] || 0;
        let newIndex = currentIndex;

        if (direction === 'next') {
            // Move forward by 1 or 4 depending on preference, here we move by 1 for smooth feel
            if (currentIndex + 4 < totalProducts) {
                newIndex = currentIndex + 1;
            }
        } else {
            if (currentIndex > 0) {
                newIndex = currentIndex - 1;
            }
        }

        setPaginationMap(prev => ({
            ...prev,
            [vendorId]: newIndex
        }));
    };

    return (
        <div className="space-y-[60px]">
            {vendorData?.data?.map((vendor: Vendor) => {
                const currentIndex = paginationMap[vendor.id] || 0;
                const visibleProducts = vendor.products?.slice(currentIndex, currentIndex + 4) || [];
                const totalProducts = vendor.products?.length || 0;

                return (
                    <div key={vendor.id}>
                        {/* Header Section */}
                        <div className="flex items-center justify-between mb-[15.5px]">
                            <h2>Accessories</h2>

                            <div className="flex items-center gap-2">
                                <Button
                                    variant="outline"
                                    size="icon"
                                    className="rounded-full bg-transparent border-gray-300 h-8 w-8 disabled:opacity-30"
                                    onClick={() => handleScroll(vendor.id, 'prev', totalProducts)}
                                    disabled={currentIndex === 0}
                                >
                                    <ChevronLeft className="h-4 w-4" />
                                </Button>
                                <Button
                                    variant="outline"
                                    size="icon"
                                    className="rounded-full bg-transparent border-gray-300 h-8 w-8 disabled:opacity-30"
                                    onClick={() => handleScroll(vendor.id, 'next', totalProducts)}
                                    disabled={currentIndex + 4 >= totalProducts}
                                >
                                    <ChevronRight className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>

                        <div className='bg-[#F5F5F5] pt-[19px] px-[14px] pb-[30px] rounded-none'>
                            {/* Seller Info Bar */}
                            <Link
                                href={`/vendor/${vendor.id}`}
                                className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-[23px]">

                                <div className="flex items-center gap-3">
                                    <div className="relative">
                                        <Image
                                            src={vendor.logo || "/default-avatar.png"}
                                            alt={vendor.name}
                                            width={56}
                                            height={50}
                                            className="rounded-full aspect-square object-cover bg-white"
                                        />
                                        <div className="absolute bottom-1 right-0 bg-[#E9A426] rounded-full p-0.5 border-2 border-white">
                                            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="text-black">
                                                <polyline points="20 6 9 17 4 12"></polyline>
                                            </svg>
                                        </div>
                                    </div>
                                    <div>
                                        <h1 className="text-lg font-bold text-[#111111]">{vendor.name}</h1>
                                        <p className="text-[#636E7E] text-sm max-w-[400px]">
                                            {vendor.address}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-4">
                                    {/* <div className="flex items-center gap-1 text-sm text-[#111111]">
                                        <div className="bg-black text-white w-[22px] h-[22px] rounded-full flex items-center justify-center">
                                            <FiMapPin size={11} />
                                        </div>
                                        <span className="font-medium max-w-[100px] truncate">{vendor.address}</span>
                                    </div> */}

                                    <div className="flex items-center gap-2 bg-[#E9A426] px-3 h-[30px] rounded-full">
                                        <div className="bg-[#111111] rounded-full p-0.5">
                                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[#E9A426]">
                                                <polyline points="20 6 9 17 4 12"></polyline>
                                            </svg>
                                        </div>
                                        <span className="text-xs font-bold text-[#111111] pt-0.5">Verified Seller</span>
                                    </div>

                                    <div className="flex items-center gap-2">
                                        <span className="text-sm font-medium text-[#111111]">4.5 rating</span>
                                        <div className="flex">
                                            {[...Array(4)].map((_, i) => (
                                                <Star key={i} size={18} fill="#E9A426" className="text-[#E9A426]" />
                                            ))}
                                            <Star size={18} className="text-[#E9A426]" />
                                        </div>
                                    </div>
                                </div>
                            </Link>

                            {/* Grid Content - Shows only sliced products */}
                            <div>
                                <GridCard
                                    vendorLogo={vendor?.logo}
                                    products={visibleProducts as Product[]}
                                    isLoading={vendorLoading}
                                />
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
    )
}

export default AccessoriesSection;