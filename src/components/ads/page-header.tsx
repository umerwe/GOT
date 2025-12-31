"use client"

import { Skeleton } from "@/components/ui/skeleton"
import Breadcrumb from "../ui/breadcrumb"

interface PageHeaderProps {
  categoryTitle: string
  resultCount: number
  isLoading?: boolean
}

export default function PageHeader({
  categoryTitle,
  isLoading = false,
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
    <div className="">
      <Breadcrumb
        items={[
          { title: "Home", href: "/" },
          { title: categoryTitle }
        ]}
      />
      <h2 className="text-[32px] mb-1">{categoryTitle}</h2>
      {/* <p className="text-gray-500">{resultCount} results</p> */}
    </div>
  )
}
