"use client"

import { Skeleton } from "@/components/ui/skeleton"

interface PageHeaderProps {
  categoryTitle: string
  resultCount: number
  isLoading?: boolean
}

export default function PageHeader({
  categoryTitle,
  resultCount,
  isLoading = false,
}: PageHeaderProps) {
  if (isLoading) {
    return (
      <div className="mb-6 space-y-2">
        <Skeleton className="h-4 w-40" />
        <Skeleton className="h-6 w-64" />
        <Skeleton className="h-4 w-24" />
      </div>
    )
  }

  return (
    <div className="">
      <p className="text-sm text-gray-600 mb-2">Home / {categoryTitle}</p>
      <h1 className="text-2xl font-bold mb-1">{categoryTitle}</h1>
      <p className="text-gray-500">{resultCount} results</p>
    </div>
  )
}
