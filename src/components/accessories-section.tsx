"use client";

import { useGetBusinessProducts, useGetSellerProducts } from '@/hooks/useProduct'
import React, { useState } from 'react'
import GridCard from './cards/grid-card';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import Image from '@/components/custom/MyImage';
import Link from 'next/link';
import { Business } from '@/types/business';
import NotFoundWrapper from '@/common/not-found';
import { Button } from "@/components/ui/button";

const AccessoriesSection = () => {
    const [paginationMap, setPaginationMap] = useState<Record<number | string, number>>({});
    const [sellerPage, setSellerPage] = useState(1);

    const { data, isLoading: businessLoading } = useGetBusinessProducts({
        type: "accessories",
        user_type: "business"
    });

    const { data: sellerData, isLoading: sellerLoading } = useGetSellerProducts({
        page: sellerPage,
        per_page: 6,
        type: "accessories"
    });

    const businessData = data?.data;
    const sellerProducts = sellerData?.data || [];
    const sellerPagination = sellerData?.pagination;

    const handleSellerPaginate = (dir: number) => {
        setSellerPage((prev) => prev + dir);
    };

    const handleBusinessPaginate = (businessId: number, dir: number) => {
        setPaginationMap((prev) => ({
            ...prev,
            [businessId]: Math.max(0, (prev[businessId] || 0) + (dir * 6))
        }));
    };

    if (!businessLoading && !sellerLoading && businessData?.length === 0 && sellerProducts.length === 0) {
        return (
            <div>
                <h2>Accessories</h2>
                <NotFoundWrapper />
            </div>
        )
    }

    return (
        <div className="space-y-4">
            <h2>Accessories</h2>

            <div className='bg-[#F5F5F5]'>

                {businessLoading ? (
                    Array.from({ length: 2 }).map((_, i) => (
                        <div key={i} className="pt-[19px] px-[14px] pb-[30px] animate-pulse">
                            <div className="flex items-center gap-3 mb-[23px]">
                                <div className="w-14 h-14 rounded-full bg-gray-200" />
                                <div className="space-y-2">
                                    <div className="h-5 w-32 bg-gray-200 rounded" />
                                    <div className="h-3 w-48 bg-gray-200 rounded" />
                                </div>
                            </div>
                            <GridCard isLoading={true} count={6} />
                        </div>
                    ))
                ) : (
                    businessData?.map((business: Business) => {
                        const currentIndex = paginationMap[business.id] || 0;
                        const totalProducts = business.products?.length || 0;
                        const visibleProducts = business.products?.slice(currentIndex, currentIndex + 6) || [];

                        return (
                            <div key={business.id} className="pt-[19px] px-[14px] pb-[30px]">
                                <div className="flex items-center justify-between mb-[23px]">
                                    <Link href={`/business/${business.id}`} className="flex items-center gap-3">
                                        <div className="relative">
                                            <Image
                                                src={business.logo || "/default-avatar.png"}
                                                alt={business.name}
                                                width={256}
                                                height={256}
                                                className="rounded-full w-14 h-14 object-cover bg-white"
                                            />
                                            <div className="absolute bottom-1 right-0 bg-[#E9A426] rounded-full p-0.5 border-2 border-white">
                                                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="text-black">
                                                    <polyline points="20 6 9 17 4 12"></polyline>
                                                </svg>
                                            </div>
                                        </div>
                                        <div>
                                            <h1 className="text-lg font-bold text-black capitalize">{business.name}</h1>
                                            <p className="text-[#636E7E] text-sm max-w-[400px] truncate">{business?.address}</p>
                                        </div>
                                    </Link>

                                    {totalProducts > 6 && (
                                        <div className="flex items-center gap-2">
                                            <Button
                                                variant="outline"
                                                size="icon"
                                                className="rounded-full h-8 w-8 bg-white"
                                                onClick={() => handleBusinessPaginate(business.id, -1)}
                                                disabled={currentIndex === 0}
                                            >
                                                <ChevronLeft className="h-4 w-4" />
                                            </Button>
                                            <Button
                                                variant="outline"
                                                size="icon"
                                                className="rounded-full h-8 w-8 bg-white"
                                                onClick={() => handleBusinessPaginate(business.id, 1)}
                                                disabled={currentIndex + 6 >= totalProducts}
                                            >
                                                <ChevronRight className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    )}
                                </div>

                                <GridCard products={visibleProducts as Product[]} isLoading={false} />
                            </div>
                        );
                    })
                )}

                {/* --- 2. PRIVATE SELLERS SECTION --- */}
                <div className="pt-[19px] px-[14px] pb-[30px]">
                    <div className="flex items-center justify-between mb-[23px]">
                        <div className="flex items-center gap-3">
                            <Image
                                src="/hero-img.png"
                                alt="Private Sellers"
                                width={256}
                                height={256}
                                className="rounded-full w-14 h-14 object-cover bg-white border border-gray-200"
                            />
                            <div>
                                <h1 className="text-lg font-bold text-black">Private Sellers</h1>
                                <p className="text-[#636E7E] text-sm">Individual listings from across the community</p>
                            </div>
                        </div>

                        {!sellerLoading && sellerProducts.length > 0 && sellerPagination && sellerPagination.totalPages > 1 && (
                            <div className="flex items-center gap-2">
                                <Button
                                    variant="outline"
                                    size="icon"
                                    className="rounded-full h-8 w-8 bg-white"
                                    onClick={() => handleSellerPaginate(-1)}
                                    disabled={sellerPage <= 1}
                                >
                                    <ChevronLeft className="h-4 w-4" />
                                </Button>
                                <Button
                                    variant="outline"
                                    size="icon"
                                    className="rounded-full h-8 w-8 bg-white"
                                    onClick={() => handleSellerPaginate(1)}
                                    disabled={sellerPage >= sellerPagination.totalPages}
                                >
                                    <ChevronRight className="h-4 w-4" />
                                </Button>
                            </div>
                        )}
                    </div>

                    <GridCard
                        products={sellerProducts as Product[]}
                        isLoading={sellerLoading}
                        isSecond={true}
                        isPrivate={true}
                    />
                </div>

            </div>
        </div>
    )
}

export default AccessoriesSection;