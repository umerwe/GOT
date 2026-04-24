"use client"

import { useGetCategories } from "@/hooks/useCategories"
import { useAddProduct } from "@/hooks/useProduct"
import { useGetBrands } from "@/hooks/useBrand"
import AuthGuard from "@/common/auth-guard"
import { AdForm } from "@/components/forms/post-ad-form"
import { useRouter } from "next/navigation"

export default function PostAd() {
  const router = useRouter()
  const { data: categories = [], isLoading: isCategoriesLoading } = useGetCategories()
  const { data: brandsData = [], isLoading: isBrandsLoading } = useGetBrands()
  const { mutate: addProduct, isPending } = useAddProduct()

  const handleCreateProduct = (formData: FormData) => {
    addProduct(formData, {
      onSuccess: () => {
        router.push("/dashboard/post-ad/thank-you")
      },
    })
  }

  return (
    <AuthGuard>
      <div className="bg-[#F3F4F6] min-h-screen">
        <div className="max-w-4xl mx-auto py-8 px-4">
          <div className="mb-[15px]">
            <h2 className="text-[20px] font-bold text-black">Post New Ad</h2>
          </div>
          <div className="bg-white p-[20px] md:p-[40px] shadow-sm border border-gray-100">
            <AdForm
              categories={categories}
              isCategoriesLoading={isCategoriesLoading}
              brandsData={brandsData}
              isBrandsLoading={isBrandsLoading}
              onSubmitAction={handleCreateProduct}
              isPending={isPending}
            />
          </div>
        </div>
      </div>
    </AuthGuard>
  )
}