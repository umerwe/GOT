"use client"
import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import type { FilterOption, FilterState, DisplayLabels } from "@/types/filters"

interface FilterSidebarProps {
  filterOptions: {
    category: FilterOption[]
    brand: FilterOption[]
    sellerType: FilterOption[]
    condition: FilterOption[]
  }
  selectedFilters: FilterState
  displayLabels: DisplayLabels
  onFilterChange: (filterType: keyof FilterState, value: string | number) => void
  onPriceRangeChange: (minPrice: number, maxPrice: number) => void
  onClearFilters: () => void
  onApplyFilters: (newCategory: string) => void
}

export default function FilterSidebar({
  filterOptions,
  selectedFilters,
  displayLabels,
  onFilterChange,
  onPriceRangeChange,
  onClearFilters,
  onApplyFilters,
}: FilterSidebarProps) {
  // Local state for temporary selection
  const [tempFilters, setTempFilters] = useState<FilterState>(selectedFilters)

  // Sync tempFilters with selectedFilters when selectedFilters changes
  useEffect(() => {
    setTempFilters(selectedFilters)
  }, [selectedFilters])

  const getFilterLabel = (filterType: keyof FilterState, value: string): string => {
    if (value === "all") {
      if (filterType === "category") return "All Categories"
      return `All ${filterType.charAt(0).toUpperCase() + filterType.slice(1)}s`
    }
    const selectedItem = filterOptions[filterType as keyof typeof filterOptions]?.find(
      (item: FilterOption) => item.id === value || item.value === value,
    )
    return selectedItem?.label ?? `All ${filterType.charAt(0).toUpperCase() + filterType.slice(1)}s`
  }

  const filterConfig = [
    { type: "category", label: "Category" },
    { type: "brand", label: "Brand" },
    { type: "sellerType", label: "Seller Type" },
  ]

  const handlePriceRangeChange = (values: number[]) => {
    const [minPrice, maxPrice] = values
    setTempFilters((prev) => ({ ...prev, min_price: minPrice, max_price: maxPrice }))
  }

  const handleApply = () => {
    // Update parent state with all tempFilters
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
    // Apply filters and close sidebar
    onApplyFilters(tempFilters.category)
  }

  return (
    <div>
      <h3 className="font-semibold text-lg lg:mt-7 mb-5">Filters</h3>
      <div className="space-y-4">
        {filterConfig.map(({ type, label }) => (
          <div key={type}>
            <label className="text-sm font-semibold mb-1 block">{label}</label>
            <Select
              onValueChange={(value) =>
                setTempFilters((prev) => ({ ...prev, [type]: value }))
              }
            >
              <SelectTrigger
                className={`w-full ${tempFilters[type as keyof FilterState] !== "all" ? "ring-2 ring-solid" : ""}`}
              >
                <SelectValue placeholder={displayLabels[type as keyof DisplayLabels]}>
                  {getFilterLabel(type as keyof FilterState, tempFilters[type as keyof FilterState] as string)}
                </SelectValue>
              </SelectTrigger>
              <SelectContent className="select__content">
                <SelectItem value="all">{getFilterLabel(type as keyof FilterState, "all")}</SelectItem>
                {filterOptions[type as keyof typeof filterOptions].map((item: FilterOption) => (
                  <SelectItem key={item.id || item.value} value={item.id || item.value || ""}>
                    {item.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        ))}

        <div>
          <label className="text-sm font-semibold mb-3 block">Price Range</label>
          <div className="space-y-3">
            <Slider
              value={[tempFilters.min_price, tempFilters.max_price]}
              onValueChange={handlePriceRangeChange}
              max={100000}
              min={0}
              step={10}
              className="slider w-full"
            />
            <div className="flex justify-between items-center text-sm text-gray-600">
              <span>{tempFilters.min_price}</span>
              <span>{tempFilters.max_price}</span>
            </div>
          </div>
        </div>
      </div>
      <div className="flex justify-between mt-10 gap-2">
        <Button variant="outline" className="w-1/2 bg-transparent" onClick={onClearFilters}>
          Clear Filters
        </Button>
        <Button variant="default" className="w-1/2 text-black" onClick={handleApply}>
          Apply
        </Button>
      </div>
    </div>
  )
}