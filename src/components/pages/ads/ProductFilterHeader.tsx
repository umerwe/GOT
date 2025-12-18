"use client"

import React from 'react'
import { ChevronDownIcon } from "lucide-react"
import { BiSolidGrid } from "react-icons/bi"
import { BsFilterLeft } from "react-icons/bs"

interface ProductFilterHeaderProps {
  sortBy: string
  setSortBy: (value: string) => void
  itemsPerPage: number
  setItemsPerPage: (value: number) => void
  viewMode: 'grid' | 'list'
  setViewMode: (mode: 'grid' | 'list') => void
}

const ProductFilterHeader = ({
  sortBy,
  setSortBy,
  itemsPerPage,
  setItemsPerPage,
  viewMode,
  setViewMode
}: ProductFilterHeaderProps) => {
  return (
    <div className="flex items-center gap-4 text-[13px] text-gray-500">
      {/* Sort By */}
      <div className="flex items-center gap-2">
        <span>Sort By:</span>
        <div className="relative">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="appearance-none border-none bg-transparent focus:ring-0 cursor-pointer pr-5 p-0 text-[13px]"
          >
            <option value="priceLowHigh">Price</option>
          </select>
          <ChevronDownIcon
            className="pointer-events-none absolute right-0 top-1 h-3.5 w-3.5 text-gray-500"
          />
        </div>
      </div>

      {/* Show Per Page */}
      <div className="hidden sm:flex items-center gap-2">
        <span>Show:</span>
        <div className="relative">
          <select
            value={itemsPerPage}
            onChange={(e) => setItemsPerPage(Number(e.target.value))}
            className="appearance-none border-none bg-transparent font-semibold text-black focus:ring-0 cursor-pointer pr-5 p-0 text-[13px]"
          >
            <option value={8}>8 per page</option>
            <option value={12}>12 per page</option>
            <option value={24}>24 per page</option>
          </select>
          <ChevronDownIcon
            className="pointer-events-none absolute right-0 top-1 h-3.5 w-3.5 text-black"
          />
        </div>
      </div>

      {/* View Toggles */}
      <div className="flex items-center gap-2 pl-2 border-l border-gray-300 ml-2">
        <button
          onClick={() => setViewMode("grid")}
          className={`transition-colors ${
            viewMode === "grid" ? "text-black" : "text-gray-400 hover:text-black"
          }`}
          title="Grid View"
        >
          <BiSolidGrid size={22} />
        </button>

        <button
          onClick={() => setViewMode("list")}
          className={`transition-colors ${
            viewMode === "list" ? "text-black" : "text-gray-400 hover:text-black"
          }`}
          title="List View"
        >
          <BsFilterLeft size={24} strokeWidth={0.5} />
        </button>
      </div>
    </div>
  )
}

export default ProductFilterHeader