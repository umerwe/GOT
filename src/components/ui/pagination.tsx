"use client"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react"

interface PaginationProps {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
  filteredProducts?: Product[]
}

export default function Pagination({ currentPage, totalPages, onPageChange, filteredProducts }: PaginationProps) {

  const getVisiblePages = () => {
    if (totalPages <= 7) {
      return Array.from({ length: totalPages }, (_, i) => i + 1)
    }

    if (currentPage <= 3) {
      return [1, 2, 3, 4, "...", totalPages]
    }

    if (currentPage >= totalPages - 2) {
      return [1, "...", totalPages - 3, totalPages - 2, totalPages - 1, totalPages]
    }

    return [
      1,
      "...",
      currentPage - 1,
      currentPage,
      currentPage + 1,
      "...",
      totalPages
    ]
  }

  if (totalPages <= 1) return null
  if (filteredProducts?.length === 0) return null

  return (
    <div className="flex items-center justify-center space-x-3 mt-8">
      <Button
        variant="outline"
        size="icon"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="h-8 w-8 rounded-full border-[#A2A6B0] transition-all duration-200 hover:scale-105"
        aria-label="Previous page"
      >
        <ChevronLeft className="h-4 w-4" />
      </Button>

      <div className="flex items-center space-x-2">
        {getVisiblePages().map((page, index) => (
          <div key={index}>
            {page === "..." ? (
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 cursor-default pt-2 hover:bg-transparent bg-transparent"
                disabled
              >
                <MoreHorizontal className="h-4 w-4 text-muted-foreground" />
              </Button>
            ) : (
              <Button
                variant={currentPage === page ? "default" : "outline"}
                size="icon"
                onClick={() => onPageChange(page as number)}
                className={`text-sm font-medium transition-all duration-200 ${currentPage === page
                  ? "scale-105 shadow-sm bg-[#F5F7FF] text-black hover:bg-gray-200 hover:text-black rounded-full"
                  : "hover:scale-105 hover:bg-gray-200 rounded-[50px] h-[32px] w-[39px] border-[#A2A6B0]"}`}
                aria-label={currentPage === page ? `Current page, page ${page}` : `Go to page ${page}`}
                aria-current={currentPage === page ? "page" : undefined}
              >
                {page}
              </Button>
            )}
          </div>
        ))}
      </div>

      <Button
        variant="outline"
        size="icon"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="h-8 w-8 rounded-full border-[#A2A6B0] transition-all duration-200 hover:scale-105"
        aria-label="Next page"
      >
        <ChevronRight className="h-4 w-4" />
      </Button>
    </div>
  )
}