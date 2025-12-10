"use client"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Skeleton } from "@/components/ui/skeleton"

interface SearchAndSortProps {
  searchTerm: string
  sortBy: string
  onSearchChange: (value: string) => void
  onSortChange: (value: string) => void
  isLoading?: boolean
}

export default function SearchAndSort({
  searchTerm,
  sortBy,
  onSearchChange,
  onSortChange,
  isLoading = false,
}: SearchAndSortProps) {

  return (
    <div className="flex flex-col items-center sm:flex-row gap-4 mb-6">
      <div className="w-full">
        {isLoading ? (
          <Skeleton className="w-full h-10" />
        ) : (
          <>
            <Input
              placeholder="Search products"
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              className=""
            />
          </>
        )}
      </div>

      {isLoading ? (
        <Skeleton className="w-full sm:w-48 h-10 rounded-md" />
      ) : (
        <Select value={sortBy} onValueChange={onSortChange}>
          <SelectTrigger className="w-full sm:w-48 mt-1 bg-yellow-400 hover:bg-yellow-500 text-black rounded-md">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="newest">Newest</SelectItem>
            <SelectItem value="priceLowHigh">Price: Low to High</SelectItem>
            <SelectItem value="priceHighLow">Price: High to Low</SelectItem>
          </SelectContent>
        </Select>
      )}
    </div>
  )
}