"use client"

import { useParams } from "next/navigation"
import { useGetProduct, useUpdateUserProduct } from "@/hooks/useProduct"
import { useGetCategories } from "@/hooks/useCategories"
import { useGetBrands } from "@/hooks/useBrand"
import { AdForm } from "@/components/forms/post-ad-form"
import AuthGuard from "@/common/auth-guard"
import SkeletonLoader from "@/common/skeleton-loader"

export default function EditAdPage() {
  const { id } = useParams()
  const { data: product, isLoading: isProductLoading } = useGetProduct(id as string)
  const { data: categories = [], isLoading: isCategoriesLoading } = useGetCategories()
  const { data: brandsData = [], isLoading: isBrandsLoading } = useGetBrands()
  const { mutate: updateProduct, isPending: isUpdating } = useUpdateUserProduct();
  
  const handleUpdate = (formData: FormData) => {
    updateProduct({ id: Number(id), formData }, {
      onSuccess: () => {
        // Optional: toast success or redirect
      }
    })
  }

  if (isProductLoading) return <SkeletonLoader type="form" />

  return (
    <AuthGuard>
      <div className="bg-[#F3F4F6] min-h-screen p-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-[20px] font-bold mb-4">Edit Ad</h2>
          <div className="bg-white p-6 md:p-10 shadow-sm">
            <AdForm
              initialData={product}
              categories={categories}
              isCategoriesLoading={isCategoriesLoading}
              brandsData={brandsData}
              isBrandsLoading={isBrandsLoading}
              onSubmitAction={handleUpdate}
              isPending={isUpdating}
            />
          </div>
        </div>
      </div>
    </AuthGuard>
  )
}