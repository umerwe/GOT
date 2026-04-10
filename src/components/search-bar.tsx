"use client"

import React, { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { useGetZones } from "@/hooks/useZones"

const SearchBar = () => {
  const [activeLocation, setActiveLocation] = useState<string>("")
  const [searchText, setSearchText] = useState("")
  const router = useRouter()
  const { data: zones, isLoading } = useGetZones()

  useEffect(() => {
    if (zones && zones.length > 0) {
      setActiveLocation(zones[0].state)
    }
  }, [zones])

  const handleSearch = () => {
    // Navigate to ads/all with state and search text as query params
    const params = new URLSearchParams()
    if (activeLocation) params.set("state", activeLocation)
    if (searchText) params.set("search", searchText)
    
    router.push(`/ads/all?${params.toString()}`)
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
          {isLoading ? (
            Array.from({ length: 3 }).map((_, i) => (
              <Skeleton
                key={i}
                className="mr-6 pb-1.5 h-[22px] w-[80px] rounded-none"
              />
            ))
          ) : (
            zones?.map((zone: { state: string }) => (
              <button
                key={zone.state}
                onClick={() => setActiveLocation(zone.state)}
                className={`mr-6 pb-1.5 text-[15px] transition-all font-medium whitespace-nowrap ${
                  activeLocation === zone.state
                    ? "border-b-4 border-yellow-500 text-black"
                    : "border-b-4 border-transparent"
                }`}
              >
                {zone.state}
              </button>
            ))
          )}
        </div>
      </div>

      <div className="pt-[20px] pb-[29px]">
        <div className="flex flex-col sm:flex-row items-stretch gap-3 sm:gap-4 w-full max-w-4xl">
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
              className="w-full bg-transparent border-none outline-none p-0 text-[#000000] placeholder:text-gray-300 text-[19px] mt-0.5"
            />
          </div>

          <Button
            onClick={handleSearch}
            variant="primary"
            className="px-12 text-lg py-8.5"
          >
            Search
          </Button>
        </div>
      </div>
    </div>
  )
}

export default SearchBar