"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import type { FilterOption, FilterState, FilterSidebarProps } from "@/types/filters"
import { ChevronDown, ChevronUp } from "lucide-react"

const PRICE_RANGES = [
  { label: "AED 10,000 - AED 15,000", min: 10000, max: 15000 },
  { label: "AED 15,000 - AED 20,000", min: 15000, max: 20000 },
  { label: "AED 20,000 - AED 25,000", min: 20000, max: 25000 },
  { label: "AED 25,000 - AED 30,000", min: 25000, max: 30000 },
  { label: "AED 30,000 - AED 35,000", min: 30000, max: 35000 },
  { label: "AED 35,000 - AED 40,000", min: 35000, max: 40000 },
  { label: "AED 40,000 - AED 45,000", min: 40000, max: 45000 },
  { label: "AED 70,000 and Above", min: 70000, max: 1000000 },
]

export default function FilterSidebar({
  filterOptions,
  selectedFilters,
  onFilterChange,
  onPriceRangeChange,
  onClearFilters,
  onApplyFilters,
}: FilterSidebarProps) {
  const [tempFilters, setTempFilters] = useState<FilterState>(selectedFilters)

  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    category: false,
    price: false,
  })

  useEffect(() => {
    setTempFilters(selectedFilters)
  }, [selectedFilters])

  const toggleSection = (section: string) => {
    setOpenSections((prev) => ({ ...prev, [section]: !prev[section] }))
  }

  const filterConfig = [
    { type: "category", label: "Category" },
  ]

  const handlePriceRangeSelect = (value: string) => {
    const [min, max] = value.split("-").map(Number)
    setTempFilters((prev) => ({ ...prev, min_price: min, max_price: max }))
  }

  const handleApply = () => {
    (Object.keys(tempFilters) as (keyof FilterState)[]).forEach((key) => {
      if (key === "min_price" || key === "max_price") {
        return
      }
      if (tempFilters[key] !== selectedFilters[key]) {
        onFilterChange(key, tempFilters[key])
      }
    })

    if (
      tempFilters.min_price !== selectedFilters.min_price ||
      tempFilters.max_price !== selectedFilters.max_price
    ) {
      onPriceRangeChange(tempFilters.min_price, tempFilters.max_price)
    }
    onApplyFilters(tempFilters.category)
  }

  return (
    <div>
      <div className="bg-[#F6F6F6] py-4">
        <div className="px-4">
          <h5 className="font-semibold text-base mb-2 text-center">Filters</h5>

          <Button
            variant="outline"
            className="w-full rounded-none mb-6 text-gray-400 bg-[#F6F6F6] border-gray-400 hover:bg-gray-50"
            onClick={onClearFilters}
          >
            Clear Filter
          </Button>
        </div>

        <div className="space-y-6 px-4">
          {filterConfig.map(({ type, label }) => {
            const isOpen = openSections[type] ?? true

            return (
              <div key={type}>
                <div
                  className="flex items-center justify-between cursor-pointer mb-3"
                  onClick={() => toggleSection(type)}
                >
                  <label className="text-sm font-semibold cursor-pointer">{label}</label>
                  {isOpen ? (
                    <ChevronDown className="h-4 w-4 text-gray-500" />
                  ) : (
                    <ChevronUp className="h-4 w-4 text-gray-500" />
                  )}
                </div>

                {isOpen && (
                  <div className="space-y-3">
                    <div className="flex items-center space-x-2">
                      <input
                        type="radio"
                        id={`${type}-all`}
                        name={`${type}-group`}
                        value="all"
                        checked={tempFilters[type as keyof FilterState] === "all" || !tempFilters[type as keyof FilterState]}
                        onChange={() => setTempFilters((prev) => ({ ...prev, [type]: "all" }))}
                        className="h-3 w-3 border-gray-300 text-red-500 checked:bg-red-500 checked:border-red-500 focus:ring-red-500 cursor-pointer"
                      />
                      <label
                        htmlFor={`${type}-all`}
                        className="text-[13px] leading-none cursor-pointer"
                      >
                        All {label === "Category" ? "Categories" : `${label}s`}
                      </label>
                    </div>

                    {filterOptions[type as keyof typeof filterOptions]?.map((item: FilterOption) => {
                      const value = item.id || item.value || ""
                      const isChecked = tempFilters[type as keyof FilterState] === value

                      return (
                        <div key={value} className="flex items-center space-x-2">
                          <input
                            type="radio"
                            id={`${type}-${value}`}
                            name={`${type}-group`}
                            value={value}
                            checked={isChecked}
                            onChange={() => setTempFilters((prev) => ({ ...prev, [type]: value }))}
                            className="h-3 w-3 border-gray-300 text-red-500 checked:bg-red-500 checked:border-red-500 focus:ring-red-500 cursor-pointer"
                          />
                          <label
                            htmlFor={`${type}-${value}`}
                            className="text-[13px] leading-none cursor-pointer"
                          >
                            {item.label}
                          </label>
                        </div>
                      )
                    })}
                  </div>
                )}
              </div>
            )
          })}

          {/* Price Range Section */}
          <div>
            <div
              className="flex items-center justify-between cursor-pointer mb-3"
              onClick={() => toggleSection('price')}
            >
              <label className="text-sm font-semibold cursor-pointer">Price Range</label>
              {openSections['price'] ? (
                <ChevronDown className="h-4 w-4 text-gray-500" />
              ) : (
                <ChevronUp className="h-4 w-4 text-gray-500" />
              )}
            </div>

            {openSections['price'] && (
              <div className="space-y-3">
                <div className="flex flex-col space-y-3">
                  {PRICE_RANGES.map((range, index) => {
                    const valueKey = `${range.min}-${range.max}`
                    const isChecked =
                      tempFilters.min_price === range.min && tempFilters.max_price === range.max

                    return (
                      <div key={index} className="flex items-center space-x-2">
                        <input
                          type="radio"
                          id={`price-${index}`}
                          name="price-range"
                          value={valueKey}
                          checked={isChecked}
                          onChange={(e) => handlePriceRangeSelect(e.target.value)}
                          className="h-3 w-3 border-gray-300 text-red-500 checked:bg-red-500 checked:border-red-500 focus:ring-red-500 cursor-pointer"
                        />
                        <label
                          htmlFor={`price-${index}`}
                          className="text-[13px] leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                        >
                          {range.label}
                        </label>
                      </div>
                    )
                  })}
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="mt-8 px-4">
          <Button
            variant="default"
            className="w-full text-white bg-black hover:bg-black/80 rounded-none"
            onClick={handleApply}
          >
            Apply Filters
          </Button>
        </div>
      </div>

      {/* Brands Section */}
      <div className="mb-[30px] mt-2.5 pt-4 bg-[#F6F6F6]">
        <div className="px-4">
          <h4 className="font-semibold text-base mb-3 text-center">Brands</h4>

          <Button
            variant="outline"
            className={`w-full rounded-none mb-4 text-gray-400 ${tempFilters.brand === 'all' ? 'bg-[#F6F6F6]' : 'bg-[#F6F6F6]'} border-gray-400 hover:bg-gray-50`}
            onClick={() => setTempFilters((prev) => ({ ...prev, brand: "all" }))}
          >
            All Brands
          </Button>

        </div>
        
        <div className="grid grid-cols-2 gap-[1px] bg-gray-200 border border-gray-200 overflow-hidden">
          {filterOptions.brand?.map((item: FilterOption) => {
            const value = item.id || item.value || ""
            const isSelected = tempFilters.brand === value

            return (
              <div
                key={value}
                className={`
                  flex items-center justify-center p-4 cursor-pointer bg-white h-20
                  ${isSelected ? 'ring-2 ring-inset ring-solid' : 'hover:bg-gray-50'}
                `}
                onClick={() => setTempFilters((prev) => ({ ...prev, brand: value }))}
              >
                {item.image ? (
                  <img src={item.image} alt={item.label} className="h-full w-auto object-contain" />
                ) : (
                  <span className="text-sm font-medium text-center">{item.label}</span>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}