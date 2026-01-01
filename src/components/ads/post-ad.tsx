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
      <div className="bg-[#F3F4F6] py-[65px]">
        <div className="max-w-5xl mx-auto px-4">
          <div className="lg:col-span-3">
            <div className="mb-[5px]">
              <h2 className="text-[20px] py-[7px]">Post New Ad</h2>
            </div>
            <div className="bg-white p-[60px] pr-[404px]">
              <AdForm
                categories={categories}
                isCategoriesLoading={isCategoriesLoading}
                brandsData={brandsData}
                isBrandsLoading={isBrandsLoading}
                addProduct={addProduct}
                isPending={isPending}
              />
              <div className="flex flex-col sm:flex-row items-center gap-4 mt-[50px]">
                <Link href="/profile" className="w-full sm:flex-1">
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full h-[48px] font-medium text-sm bg-transparent rounded-none"
                  >
                    View Existing Ads
                  </Button>
                </Link>

                <Link href="/post-ad" className="w-full sm:flex-1">
                  <Button
                    type="button"
                    className="w-full bg-black hover:bg-black/80 text-white text-sm h-[48px] font-medium rounded-none"
                  >
                    Post Another
                  </Button>
                </Link>
              </div>

              <p className="text-sm text-[#99A1AF] pt-[19.5px] pb-[24.5px] flex items-center justify-center">
                Your ad is under review. We&apos;ll notify you when it&apos;s live!
              </p>

              <h5 className="text-sm   mb-[12.5px]">Current Ads</h5>
              <AdsTable type="post-ad" />
            </div>
          </div>
        </div>
      </div>
    </AuthGuard>
  )
}
