"use client";

import { useGetBusinessProducts } from '@/hooks/useProduct'
import React, { useState } from 'react'
import GridCard from './cards/grid-card';
import { Loader } from 'lucide-react';
import Image from '@/components/custom/MyImage';
import Link from 'next/link';
import { Business } from '@/types/business';
import NotFoundWrapper from '@/common/not-found';

const AccessoriesSection = () => {
    const { data, isLoading: businessLoading } = useGetBusinessProducts({
        type: "accessories"
    });
    const businessData = data?.data;

    const [paginationMap] = useState<Record<number | string, number>>({});

    if (businessLoading) return (
        <div className="flex items-center justify-center h-[20vh]">
            <Loader className='animate-spin' />
        </div>
    );

    if (!businessLoading && businessData?.length === 0) {
        return <div>
            <h2>Accessories</h2>
            <NotFoundWrapper />
        </div>
    }

    return (
        <div className="space-y-4">
            <h2>Accessories</h2>

            <div className='bg-[#F5F5F5]'>
                {businessData?.map((business: Business) => {
                    const currentIndex = paginationMap[business.id] || 0;
                    const visibleProducts = business.products?.slice(currentIndex, currentIndex + 6) || [];

                    return (
                        <div key={business.id} className="pt-[19px] px-[14px] pb-[30px]">
                            <Link
                                href={`/business/${business.id}`}
                                className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-[23px]">

                                <div className="flex items-center gap-3">
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
                                        <p className="text-[#636E7E] text-sm max-w-[400px]">
                                            {business.address}
                                        </p>
                                    </div>
                                </div>
                            </Link>

                            <div>
                                <GridCard
                                    businessLogo={business?.logo}
                                    products={visibleProducts as Product[]}
                                    isLoading={businessLoading}
                                />
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    )
}

export default AccessoriesSection;