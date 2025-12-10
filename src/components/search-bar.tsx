"use client"

import React, { useState } from "react"
import { useRouter } from "next/navigation"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

const LOCATIONS = ["Dubai", "Abu Dhabi", "Sharjah", "Ras Al Khaimah", "Umm Al Quwain", "Fujairah"]

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
        // Removed 'mt-12' to fix absolute positioning alignment
        <div className="bg-white rounded-sm shadow-sm border border-gray-100">
            <div className="flex flex-wrap items-center border-b border-gray-200 px-6 pt-4">
                {LOCATIONS.map((loc) => (
                    <button
                        key={loc}
                        onClick={() => setActiveLocation(loc)}
                        className={`mr-6 pb-3 text-sm font-medium transition-all ${activeLocation === loc
                            ? "border-b-4 border-yellow-500 text-black font-bold"
                            : "text-gray-500 hover:text-gray-800 border-b-4 border-transparent"
                            }`}
                    >
                        {loc}
                    </button>
                ))}
            </div>

            <div className="px-4 sm:px-6 mb-4 mt-2 flex flex-col sm:flex-row gap-4 items-center">
                <div className="w-full flex-1">
                    <label className="text-xs md:text-base font-semibold text-gray-500 block">
                        Search query
                    </label>
                    <div className="flex items-center gap-2">
                        <Input
                            placeholder="Ex. KTM 690 Enduro R"
                            value={searchText}
                            onChange={(e) => setSearchText(e.target.value)}
                            onKeyDown={handleKeyDown}
                            className="rounded-sm h-12"
                        />
                        <Button
                            onClick={handleSearch}
                            className="w-full mt-1 sm:w-auto px-10 h-12 bg-solid hover:bg-hover text-black font-medium text-lg rounded-sm"
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