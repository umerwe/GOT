'use client'

import { useGetBrands } from '@/hooks/useBrand'
import React from 'react'
import Image from 'next/image'
import { Brand } from '@/types/filters'
import { motion } from 'framer-motion'

const BrandsSection = () => {
  const { data, isLoading } = useGetBrands();

  const duplicatedData = data ? [...data, ...data] : [];

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
        <div className="overflow-hidden whitespace-nowrap py-2">
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
                className="relative h-16 w-32 flex-shrink-0 cursor-pointer"
              >
                <Image
                  src={brand?.image}
                  alt={`Brand Logo ${index + 1}`}
                  fill
                  className="object-contain"
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