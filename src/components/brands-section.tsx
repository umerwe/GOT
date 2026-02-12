'use client'

import { useGetBrands } from '@/hooks/useBrand'
import React from 'react'
import Image from 'next/image'
import { Brand } from '@/types/filters'
import { motion } from 'framer-motion'
import NotFoundWrapper from '@/common/not-found'

const BrandsSection = () => {
  const { data, isLoading } = useGetBrands();

  const duplicatedData = data ? [...data, ...data] : [];

  return (
    <section className="bg-white border-b-3 border-[#EBEBEB] pb-[20px]">
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-bold">Brands</h2>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-8 gap-6">
          {[...Array(8)].map((_, index) => (
            <div
              key={`skeleton-${index}`}
              className="h-[103.82px] w-full bg-gray-200 rounded-md animate-pulse"
            />
          ))}
        </div>
      ) : data?.length === 0 ? (
        <NotFoundWrapper />
      ) : (
        <div className="overflow-hidden whitespace-nowrap">
          <motion.div
            className="flex gap-12 w-max"
            animate={{ x: ["0%", "-50%"] }}
            transition={{
              ease: "linear",
              duration: 70,
              repeat: Infinity,
            }}
          >
            {duplicatedData.map((brand: Brand, index: number) => (
              <div
                key={`${brand.id || index}-${index}`}
                className="relative h-[103.82px] w-[129.78px] flex-shrink-0 cursor-pointer"
              >
                <Image
                  src={brand?.image}
                  alt={`Brand Logo ${index + 1}`}
                  fill
                  className="object-contain"
                  sizes="129.78px"
                />
              </div>
            ))}
          </motion.div>
        </div>
      )}
    </section>
  )
}

export default BrandsSection