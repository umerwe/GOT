"use client"
import { useParams } from "next/navigation"
import { useGetProduct } from "@/hooks/useProduct"
import SkeletonLoader from "@/common/skeleton-loader"
import NotFoundWrapper from "@/common/not-found"
import Listing from "@/components/pages/listing"
import Breadcrumb from "@/components/ui/breadcrumb"
import Container from "@/components/container"
import Footer from "@/components/footer"

export default function ListingById() {
  const { id } = useParams()
  const { data: product, isLoading } = useGetProduct(id as string)
  
  if (isLoading) return <SkeletonLoader type="alllisting" />
  if (!product) return <NotFoundWrapper itemName="Product" />

  return (
    <div>
      <Container className="max-w-[1400px] mx-auto px-3 mt-4">
        <Breadcrumb
          items={[
            { title: "Home", href: "/" },
            { title: product.category?.title || "", href: `/ads/${product.category?.id}` },
            { title: product.title }
          ]}
        />
      </Container>
      <Container className="pt-10 pb-16">
        <Listing
          product={product}
        />
      </Container>

      <Footer />
    </div>
  )
}
