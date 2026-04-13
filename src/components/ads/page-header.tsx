"use client"

import { Skeleton } from "@/components/ui/skeleton"
import Breadcrumb from "../ui/breadcrumb"

interface PageHeaderProps {
  categoryTitle: string
  resultCount: number
  isLoading?: boolean
  searchQuery?: string | null // Added this
}

export default function PageHeader({
  categoryTitle,
  isLoading = false,
  searchQuery, // Destructure this
}: PageHeaderProps) {
  if (isLoading) {
    return (
      <div className="mb-6 space-y-2">
        <Skeleton className="h-4 w-40" />
        <Skeleton className="h-6 w-64" />
      </div>
    )
  }

  return (
    <div className="px-[8px]">
      <Breadcrumb
        items={[
          { title: "Home", href: "/" },
          { title: categoryTitle }
        ]}
      />
      <div className="flex flex-col gap-1">
        <h2 className="text-[32px] font-bold text-black capitalize">
          {categoryTitle}
        </h2>
        {/* Indication for active search query */}
        {searchQuery && (
          <p className="text-gray-500 text-lg italic">
            Showing results for <span className="text-black font-semibold">"{searchQuery}"</span>
          </p>
        )}
      </div>
    </div>
  )
}