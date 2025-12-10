"use client"
import { useParams } from "next/navigation"
import { useGetProduct } from "@/hooks/useProduct"
import SkeletonLoader from "@/common/skeleton-loader"
import NotFoundWrapper from "@/common/not-found"
import Listing from "@/components/pages/listing"

export default function ListingById() {
  const { id } = useParams()
  const { data: product, isLoading } = useGetProduct(id as string)

  if (isLoading) return <SkeletonLoader type="alllisting" />
  if (!product) return <NotFoundWrapper itemName="Product" />

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <Listing product={product} />
    </div>
  )
}
