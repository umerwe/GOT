"use client"

import React from "react"
import Image from "next/image"
import SearchBar from "./search-bar"

const HeroSection = () => {
  return (
    <div className="relative min-h-[520px] sm:min-h-[550px] flex items-center justify-center">

      <div className="absolute inset-0 w-full h-full overflow-hidden -z-10">
        <Image
          src="/hero-img.jpg"
          alt="Bike Journey Hero Background"
          fill
          className="object-cover"
          priority
          quality={90}
        />
        <div className="absolute inset-0 bg-black/40" />
      </div>

      <div className="container relative mx-auto px-4 sm:px-6 lg:px-8 z-10 flex flex-col items-start justify-center h-full pb-16 sm:pb-0">
        <div className="w-full max-w-[630px]">
          <h1 className="text-xl xs:text-[28px] text-white mb-4 leading-tight">
            The <span className="text-solid">Leading Marketplace</span> for buying and selling everything Motorcycles, Parts, Gear and Accessories
          </h1>

          <p className="text-[16px] sm:text-xl text-solid mb-8 leading-relaxed">
            Buy, sell, and connect with fellow Bike enthusiasts in the UAE
          </p>
        </div>
      </div>

      <div className="absolute bottom-14 left-1/2 transform -translate-x-1/2 translate-y-1/2 w-full max-w-4xl px-2 md:px-4 z-20">
        <SearchBar />
      </div>
    </div>
  )
}

export default HeroSection