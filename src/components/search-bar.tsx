"use client"

import React, { useState } from "react"
import { useRouter } from "next/navigation"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { LOCATIONS } from "@/constants/locations"

const SearchBar = () => {
  const [activeLocation, setActiveLocation] = useState("Dubai")
  const [searchText, setSearchText] = useState("")
  const router = useRouter()

  const handleSearch = () => {
    if (searchText.trim() !== "") {
      router.push(`/listing?title=${encodeURIComponent(searchText)}&location=${activeLocation}`)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch()
    }
  }

  return (
    <div className="bg-white shadow-sm border-[3px] border-[#F1F1F1] w-full px-2 sm:px-[60px] pt-[28px]">
      <div className="flex items-center overflow-x-auto border-b-2 border-gray-200 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
        <div className="flex flex-nowrap">
          {LOCATIONS.map((loc) => (
            <button
              key={loc}
              onClick={() => setActiveLocation(loc)}
              className={`mr-6 pb-1.5 text-[15px] transition-all font-medium whitespace-nowrap ${activeLocation === loc
                  ? "border-b-4 border-yellow-500 text-black"
                  : "border-b-4 border-transparent"
                }`}
            >
              {loc}
            </button>
          ))}
        </div>
      </div>

      <div className="pt-[20px] pb-[29px]">
        <div className="flex flex-col sm:flex-row items-stretch gap-3 sm:gap-4 w-full max-w-4xl">
          {/* Input Container with Label Inside */}
          <div className="flex-1 border border-gray-300 bg-white px-[24px] py-2 flex flex-col justify-center min-h-[40px]">
            <label>
              <h6 className="text-[15px] font-medium text-black block leading-tight">Search query</h6>
            </label>
            <input
              type="text"
              placeholder="Ex. KTM 690 Enduro R"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              onKeyDown={handleKeyDown}
              className="w-full bg-transparent border-none outline-none p-0 text-[#BBBBBB] placeholder:text-gray-300 text-[19px] mt-0.5"
            />
          </div>

          {/* Search Button */}
          <button
            onClick={handleSearch}
            className="w-full sm:w-auto px-12 bg-[#F2A416] hover:bg-[#e0941a] transition-colors text-black font-medium text-lg shrink-0 flex items-center justify-center min-h-[40px] font-['DM_Sans',sans-serif]"
          >
            Search
          </button>
        </div>
      </div>
    </div>
  )
}

export default SearchBar