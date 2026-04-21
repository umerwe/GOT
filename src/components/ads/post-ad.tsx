"use client"

import { useGetCategories } from "@/hooks/useCategories"
import { useAddProduct } from "@/hooks/useProduct"
import { useGetBrands } from "@/hooks/useBrand"
import AuthGuard from "@/common/auth-guard"
import { AdForm } from "@/components/forms/post-ad-form"

export default function PostAd() {
  const { data: categories = [], isLoading: isCategoriesLoading } = useGetCategories()
  const { data: brandsData = [], isLoading: isBrandsLoading } = useGetBrands()
  const { mutate: addProduct, isPending } = useAddProduct()

  return (
    <AuthGuard>
      <div className="bg-[#F3F4F6]">
        <div className="">
          <div className="lg:col-span-3">
            <div className="mb-[5px]">
              <h2 className="text-[20px] mb-[10px]">Post New Ad</h2>
            </div>
            <div className="bg-white p-[20px] md:p-[40px]">
              <AdForm
                categories={categories}
                isCategoriesLoading={isCategoriesLoading}
                brandsData={brandsData}
                isBrandsLoading={isBrandsLoading}
                addProduct={addProduct}
                isPending={isPending}
              />
            </div>
          </div>
        </div>
      </div>
    </AuthGuard>
  )
}
