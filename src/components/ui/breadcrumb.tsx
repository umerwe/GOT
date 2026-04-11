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
      {/* flex-wrap allows items to move to the next line on small mobile screens */}
      <ol className="flex flex-wrap items-center">
        {items.map((item, index) => {
          const isLast = index === items.length - 1
          return (
            <li 
              key={index} 
              className={isLast ? "text-solid min-w-0" : "min-w-0"}
            >
              {isLast ? (
                /* max-w-xs or a similar constraint helps the truncate logic trigger */
                <span className="truncate block max-w-[150px] sm:max-w-[300px] md:max-w-full" title={item.title}>
                  {capitalizeWords(item.title)}
                </span>
              ) : (
                <div className="flex items-center">
                  <Link 
                    href={item.href || "#"} 
                    className="text-gray-900 truncate hover:underline max-w-[100px] sm:max-w-[200px] md:max-w-full"
                    title={item.title}
                  >
                    {capitalizeWords(item?.title)}
                  </Link>
                  <ChevronRight className="mx-2 text-[#0156FF] w-3 h-3 flex-shrink-0" />
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