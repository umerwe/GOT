"use client";

import { useGetProducts } from '@/hooks/useProduct'
import React, { useState } from 'react'
import { Button } from '@/components/ui/button';
import GridCard from './cards/grid-card';
import { ChevronLeft, ChevronRight, Star } from 'lucide-react';
import Image from 'next/image';
import { FiMapPin } from "react-icons/fi";
import Link from 'next/link';


const AccessoriesSection = ({ isSecond, logo }: { isSecond?: boolean, logo?: boolean }) => {
    const [page, setPage] = useState(1);

    const { data, isLoading } = useGetProducts({
        type: "accessories",
        page: page,
        per_page: 4
    });

    const accessoriesData = data?.data || [];
    const pagination = data?.pagination;

    const handlePaginate = (dir: number) => {
        setPage((prev) => prev + dir);
    };

    return (
        <div>
            {/* Header Section */}
            <div className="flex items-center justify-between mb-[15.5px]">
                <h2 className="text-[28px] font-bold text-[#111111]">Accessories</h2>

                <div className="flex items-center gap-2">
                    <Button
                        variant="outline"
                        size="icon"
                        className="rounded-full bg-transparent border-gray-300 h-8 w-8"
                        onClick={() => handlePaginate(-1)}
                        disabled={page <= 1 || isLoading}
                    >
                        <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <Button
                        variant="outline"
                        size="icon"
                        className="rounded-full bg-transparent border-gray-300 h-8 w-8"
                        onClick={() => handlePaginate(1)}
                        disabled={!pagination || page >= pagination.totalPages || isLoading}
                    >
                        <ChevronRight className="h-4 w-4" />
                    </Button>
                </div>
            </div>

            <div className='bg-[#F5F5F5] pt-[19px] px-[14px] pb-[30px] rounded-none'>
                {/* Seller Info Bar */}
                <Link
                    href="/seller"
                    className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-[23px]">
                    <div className="flex items-center gap-3">
                        <div className="relative">
                            <Image
                                src={isSecond ? "/saif.png" : "/moto-mania.png"}
                                alt="MotoMania"
                                width={56}
                                height={50}
                                className="rounded-full object-contain"
                            />
                            <div className="absolute bottom-1 right-0 bg-[#E9A426] rounded-full p-0.5">
                                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-black"><polyline points="20 6 9 17 4 12"></polyline></svg>
                            </div>
                        </div>
                        <div>
                            <h1 className="text-lg text-[#111111]">{isSecond ? "Saif Al-Mansoori" : "MotoMania"}</h1>
                            <p className="text-[#636E7E] text-sm">{isSecond ? "Premier distributor of motorbike parts and accessories in the UAE. " : "Premier distributor of motorbike parts and accessories in the UAE."}</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-1 text-sm text-[#111111]">
                            <div className="bg-black text-white w-[22px] h-[22px] rounded-[60px] flex items-center justify-center">
                                <FiMapPin size={11} />
                            </div>
                            <span>UAE, Dubai</span>
                        </div>

                        <div className="flex items-center gap-2 bg-[#E9A426] px-3 h-[30px] rounded-full">
                            <div className="bg-[#111111] rounded-full p-0.5">
                                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[#E9A426]"><polyline points="20 6 9 17 4 12"></polyline></svg>
                            </div>
                            <span className="text-xs font-medium text-[#111111] pt-0.5">Verified Seller</span>
                        </div>

                        <div className="flex items-center gap-2">
                            <span className="text-sm font-medium text-[#111111]">4.5 rating</span>
                            <div className="flex">
                                {[...Array(4)].map((_, i) => (
                                    <Star key={i} size={20} fill="#E9A426" className="text-[#E9A426]" />
                                ))}
                                <Star size={20} className="text-[#E9A426]" />
                            </div>
                        </div>
                    </div>
                </Link>

                {/* Grid Content */}
                <div className="md:grid-cols-5">
                    <GridCard products={accessoriesData} isLoading={isLoading} isSecond={logo } />
                </div>
            </div>
        </div>
    )
}

export default AccessoriesSection;