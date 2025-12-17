'use client'

import { useGetBrands } from '@/hooks/useBrand'
import React from 'react'
import Image from 'next/image'
import { Brand } from '@/types/filters'

const BrandsSection = () => {
  const { data, isLoading } = useGetBrands();

  const brands = (data || []).slice(0, 8);
  
  return (
    <section className="bg-white border-b-3 border-[#EBEBEB] pb-4">
      
      <div className="flex items-center justify-between mb-[10px]">
        <h2 className="text-2xl font-semibold">Brands</h2>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-4 md:grid-cols-8 gap-6">
          {[...Array(8)].map((_, index) => (
            <div
              key={`skeleton-${index}`}
              className="h-16 w-full bg-gray-200 rounded-md animate-pulse"
            />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-4 md:grid-cols-8 gap-6">
          {brands.map((brand: Brand, index: number) => (
            <div
              key={`${brand.id || index}`} 
              className="relative h-16 w-full cursor-pointer"
            >
              <Image
                src={brand.image}
                alt={`Brand Logo ${index + 1}`}
                fill
                className="object-contain"
              />
            </div>
          ))}
        </div>
      )}
    </section>
  )
}

export default BrandsSection