"use client"

import React from "react"
import Image from "next/image"
import SearchBar from "./search-bar"

const HeroSection = () => {
  return (
    <div className="relative min-h-[520px] sm:min-h-[598px] flex items-center justify-center">

       <div className="absolute inset-0 w-full h-full overflow-hidden -z-10">
        <Image
          src="/hero-img.png"
          alt="Bike Journey Hero Background"
          fill
          className="object-cover object-top" 
          priority
          quality={90}
        />
        <div 
          className="absolute inset-0" 
          style={{
            background: "linear-gradient(180deg, rgba(0, 0, 0, 0.1) 0%, rgba(0, 0, 0, 0.1) 10%, rgba(0, 0, 0, 0) 100%)"
          }}
        />
      </div>

      <div className="container relative mx-auto pl-5 md:pl-[66px] z-10 flex flex-col items-start justify-center h-full pb-16 sm:pb-0">
        <div className="w-full max-w-[655px]">
          <h1 className="text-[28px] text-white mb-4 leading-tight">
            The <span className="text-solid">Leading Marketplace</span> for buying and selling everything Motorcycles, Parts, Gear and Accessories
          </h1>

          <p className="text-[16px] text-solid mb-8 leading-relaxed">
            Buy, sell, and connect with fellow Bike enthusiasts in the UAE
          </p>
        </div>
      </div>

      <div className="absolute bottom-18 left-1/2 transform -translate-x-1/2 translate-y-1/2 w-full max-w-4xl px-2 md:px-4 z-20">
        <SearchBar />
      </div>
    </div>
  )
}

export default HeroSection