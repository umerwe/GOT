"use client"

import { useGetCategories } from "@/hooks/useCategories"
import { useAddProduct } from "@/hooks/useProduct"
import { useGetBrands } from "@/hooks/useBrand"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import AdsTable from "@/components/current-ads"
import AuthGuard from "@/common/auth-guard"
import { AdForm } from "@/components/forms/post-ad"

export default function PostAd() {
  const { data: categories = [], isLoading: isCategoriesLoading } = useGetCategories()
  const { data: brandsData = [], isLoading: isBrandsLoading } = useGetBrands()
  const { mutate: addProduct, isPending } = useAddProduct()

  return (
    <AuthGuard>
      <div className="bg-gray-50 py-10">
        <div className="max-w-5xl mx-auto px-4">
          <div className="lg:col-span-3">
            <div className="mb-6">
              <h1 className="text-2xl font-bold text-gray-900 mb-2">Post New Ad</h1>
              <p className="text-gray-600">Community users can post up to 2 ads</p>
            </div>
            <AdForm
              categories={categories}
              isCategoriesLoading={isCategoriesLoading}
              brandsData={brandsData}
              isBrandsLoading={isBrandsLoading}
              addProduct={addProduct}
              isPending={isPending}
            />
            <div className="flex justify-center items-center gap-4 mt-4">
              <Link href="/profile">
                <Button
                  type="button"
                  variant="outline"
                  className="px-4 py-2 text-sm md:px-6 md:py-3 md:text-base bg-transparent"
                >
                  View Existing Ads
                </Button>
              </Link>
              <Link href="/post-ad">
                <Button
                  type="button"
                  className="bg-yellow-400 hover:bg-yellow-500 text-black px-4 py-2 text-sm md:px-10 md:py-3 md:text-base"
                >
                  Post Another
                </Button>
              </Link>
            </div>
            <h1 className="text-lg font-semibold mb-3">Current Ads</h1>
            <AdsTable />
          </div>
        </div>
      </div>
    </AuthGuard>
  )
}
