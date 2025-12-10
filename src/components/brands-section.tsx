'use client'

import { useGetBrands } from '@/hooks/useBrand'
import React from 'react'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { Brand } from '@/types/filters'

const BrandsSection = () => {
  const { data, isLoading } = useGetBrands();

  const brands = data || [];

  return (
    <section className="px-2 sm:px-4 md:px-6 lg:px-8 xl:px-10 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-6 px-2">
          <h2 className="text-2xl font-semibold">Brands</h2>
        </div>

        <div
          className="flex overflow-hidden select-none"
          style={{
            maskImage: 'linear-gradient(to right, transparent, black 10%, black 90%, transparent)',
            WebkitMaskImage: 'linear-gradient(to right, transparent, black 10%, black 90%, transparent)'
          }}
        >
          {isLoading ? (<div className="flex flex-shrink-0 gap-10 pr-10 w-full">
            {[...Array(8)].map((_, index) => (
              <div
                key={`skeleton-${index}`}
                className="h-16 w-32 flex-shrink-0 bg-gray-200 rounded-md animate-pulse"
              />
            ))}
          </div>
          ) : (
            <motion.div
              className="flex flex-shrink-0 gap-10 pr-10"
              animate={{
                x: ["0%", "-50%"],
              }}
              transition={{
                repeat: Infinity,
                ease: "linear",
                duration: 70,
              }}
            >
              {brands.map((brand: Brand, index: number) => (
                <div
                  key={`${brand.id || index}-${index}`}
                  className="relative h-16 w-32 flex-shrink-0 grayscale hover:grayscale-0 transition-all duration-300 cursor-pointer"
                >
                  <Image
                    src={brand.image}
                    alt="Brand Logo"
                    fill
                    className="object-contain"
                  />
                </div>
              ))}
            </motion.div>
          )}
        </div>
      </div>
    </section>
  )
}

export default BrandsSection