"use client"

import React from "react"
import Image from "@/components/custom/MyImage"
import SearchBar from "./search-bar"

const HeroSection = () => {
  return (
    <div className="relative min-h-[598px] flex items-center">

      {/* Background */}
      <div className="absolute inset-0 w-full h-full overflow-hidden -z-10">
        <Image
          src="/hero-img.png"
          alt="Bike Journey Hero Background"
          fill
          className="object-cover object-top"
          priority
          quality={90}
        />
      </div>

      {/* Text Section */}
      <div className="relative z-10 w-full px-5 md:pl-[66px]">
        <div className="max-w-[655px] -mt-20 sm:-mt-0">
          <h1 className="md:text-[28px] text-[24px] text-white mb-4 leading-tight">
            The <span className="text-solid">Marketplace</span> built for riders and drivers — Motorcycles, 4x4s, Adventure Vehicles, Parts, Gear and Accessories
          </h1>

          <p className="md:text-[16px] text-[14px] text-solid mb-8 leading-relaxed">
            Buy, sell and connect with fellow Bike enthusiasts in the UAE
          </p>
        </div>
      </div>

      {/* Search Bar */}
      <div className="absolute bottom-18 left-1/2 -translate-x-1/2 translate-y-23 w-full max-w-4xl px-2 md:px-4 z-20">
        <SearchBar />
      </div>
    </div>

  )
}

export default HeroSection