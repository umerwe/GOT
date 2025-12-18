"use client"
import { capitalizeWords } from "@/utils/capitalizeWords"
import { ChevronRight } from "lucide-react"
import Link from "next/link"
import React from "react"

type BreadcrumbItem = {
  title: string
  href?: string
}

type BreadcrumbProps = {
  items: BreadcrumbItem[]
}

const Breadcrumb: React.FC<BreadcrumbProps> = ({ items }) => {
  if (!items || items.length === 0) return null

  return (
    <nav className="text-sm" aria-label="breadcrumb">
      <ol className="flex items-center">
        {items.map((item, index) => {
          const isLast = index === items.length - 1
          return (
            <li key={index} className={isLast ? "text-solid" : ""}>
              {isLast ? (
                <span>{capitalizeWords(item.title)}</span>
              ) : (
                <div className="flex items-center">
                  <Link href={item.href || "#"} className="text-gray-900 hover:underline">
                    {capitalizeWords(item?.title)}
                  </Link>
                  <ChevronRight className="mx-2 text-[#0156FF] w-3 h-3" />
                </div>
              )}
            </li>
          )
        })}
      </ol>
    </nav>
  )
}

export default Breadcrumb
