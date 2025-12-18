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
    <div className="bg-white rounded-sm shadow-sm border border-gray-100 w-full">
      <div className="flex items-center overflow-x-auto border-b border-gray-200 px-2 sm:px-6 pt-4 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
        <div className="flex flex-nowrap">
          {LOCATIONS.map((loc) => (
            <button
              key={loc}
              onClick={() => setActiveLocation(loc)}
              className={`mr-6 pb-3 text-sm font-medium transition-all whitespace-nowrap ${
                activeLocation === loc
                  ? "border-b-4 border-yellow-500 text-black font-bold"
                  : "text-gray-500 hover:text-gray-800 border-b-4 border-transparent"
              }`}
            >
              {loc}
            </button>
          ))}
        </div>
      </div>

      <div className="py-4 px-2 sm:px-6 sm:pb-6 sm:pt-4">
        <div className="w-full">
          <label className="text-xs sm:text-sm font-semibold text-gray-500 block mb-2">
            Search query
          </label>
          <div className="flex flex-col sm:flex-row items-stretch gap-3 sm:gap-4">
            <Input
              placeholder="Ex. KTM 690 Enduro R"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              onKeyDown={handleKeyDown}
              className="rounded-sm h-12 w-full text-base"
            />
            <Button
              onClick={handleSearch}
              className="w-full sm:w-auto px-8 h-12 bg-solid hover:bg-hover text-black font-medium text-lg rounded-sm shrink-0"
            >
              Search
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SearchBar