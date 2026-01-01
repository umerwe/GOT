"use client"

import Image from "next/image"
import { Button } from "@/components/ui/button"
import { capitalizeWords } from "@/utils/capitalizeWords"
import LoginDialog from "@/utils/loginDialog"
import { useState } from "react"
import { useAppSelector } from "@/store/hooks"
import { useRouter } from "next/navigation"
import {
  MapPin,
  MessageCircle,
  Phone,
  AlertCircle,
  ChevronLeft,
  ChevronRight
} from "lucide-react"
import { cn } from "@/lib/utils"

interface ProductDetailsProps {
  product: Product
}

export default function Listing({ product }: ProductDetailsProps) {
  const [activeImage, setActiveImage] = useState<string | null>(
    product?.product_images?.[0] ?? null
  )
  const [showLoginDialog, setShowLoginDialog] = useState(false)
  const [showPhone, setShowPhone] = useState(false)

  const { token, userId } = useAppSelector((state) => state?.auth)
  const router = useRouter()

  const handleChatClick = () => {
    if (!token) {
      setShowLoginDialog(true)
      return
    }

    if (product?.user) {
      localStorage.setItem(
        "chatUser",
        JSON.stringify({
          id: product.user.id,
          name: product.user.name,
          profile_image: product.user.profile_image,
        })
      )
    }

    router.push(`/chat/${product?.user?.id}`)
  }

  const handleNextImage = () => {
    if (!product.product_images) return
    const currentIndex = product.product_images.indexOf(activeImage || "")
    const nextIndex = (currentIndex + 1) % product.product_images.length
    setActiveImage(product.product_images[nextIndex])
  }

  const handlePrevImage = () => {
    if (!product.product_images) return
    const currentIndex = product.product_images.indexOf(activeImage || "")
    const prevIndex =
      (currentIndex - 1 + product.product_images.length) %
      product.product_images.length
    setActiveImage(product.product_images[prevIndex])
  }

  return (
    <div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-[22px]">
        {/* --- LEFT COLUMN: Images & Description --- */}
        <div className="lg:col-span-2 space-y-[20px]">

          {/* Main Image Gallery */}
          <div className="bg-gray-50 rounded-none overflow-hidden relative group">
            <div className="relative w-full aspect-[4/3] lg:aspect-[16/10]">
              <Image
                src={activeImage || "/placeholder.svg"}
                alt="Product Main"
                fill
                className="object-cover bg-gray-100"
              />

              {/* Navigation Arrows */}
              <>
                <button
                  disabled={(product.product_images?.length || 0) <= 1}
                  onClick={(e) => {
                    e.stopPropagation()
                    handlePrevImage()
                  }}
                  className={cn(
                    "absolute left-4 top-1/2 -translate-y-1/2 p-2 shadow-md transition-all",
                    "bg-white hover:bg-gray-100",
                    "cursor-pointer",
                    (product.product_images?.length || 0) <= 1 &&
                    "cursor-not-allowed"
                  )}
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>

                <button
                  disabled={(product.product_images?.length || 0) <= 1}
                  onClick={(e) => {
                    e.stopPropagation()
                    handleNextImage()
                  }}
                  className={cn(
                    "absolute right-4 top-1/2 -translate-y-1/2 p-2 shadow-md transition-all",
                    "bg-white hover:bg-gray-100",
                    "cursor-pointer",
                    (product.product_images?.length || 0) <= 1 &&
                    "cursor-not-allowed"
                  )}
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </>
            </div>
          </div>

          {/* Specs Grid (Replicating the bottom grid in image) */}
          <div className="border-2 border-gray-200 rounded-none p-6 bg-white">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-y-6 gap-x-4">
              <SpecBox label="Usage" value={product.usage ? capitalizeWords(product.usage) : "-"} />
              <SpecBox label="Condition" value={product.condition} />
              <SpecBox
                label="Mileage"
                value={product.mileage ? `${product.mileage} ${product.mileage_unit || 'km'}` : "-"}
              />
              <SpecBox label="Year" value={product.manufacturing_year} />
              <SpecBox label="Final Drive" value={capitalizeWords(product?.final_drive_system)} />
              <SpecBox label="Wheels" value={capitalizeWords(product?.wheels)} />
              <SpecBox label="Engine Size" value={capitalizeWords(product.engine_size)} />
              <SpecBox label="Warranty" value={product.warranty ? "Yes" : "No"} />
            </div>
          </div>

          {/* Description */}
          <div className="space-y-[11px]">
            <h1 className="text-[18px]">Overview</h1>
            <div className="text-gray-600 text-sm font-normal">
              {product.description}
            </div>
          </div>
        </div>

        {/* --- RIGHT COLUMN: Details & Actions --- */}
        <div className="lg:col-span-1 space-y-[10px] sm:px-[24px]">

          {/* Title Header */}
          <div className="space-y-[10px]">
            {/* <div className="flex gap-2 mb-2">
              <span className="bg-yellow-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-sm uppercase tracking-wide">
                Featured
              </span>
              <span className="bg-gray-200 text-gray-700 text-[10px] font-bold px-2 py-0.5 rounded-sm uppercase tracking-wide">
                Verified
              </span>
            </div> */}

            <h3 className="text-[18px] w-[199px] leading-[24px] tracking-[-0.31px]">
              {capitalizeWords(product?.title)}
            </h3>

            <div className="text-sm text-gray-500 flex flex-wrap gap-x-2">
              <span>{product.brand?.title || "None"}</span>
              <span>•</span>
              <span>{product.category?.title || "None"}</span>
            </div>

            <div className="flex gap-2 text-gray-500 text-sm">
              <MapPin className="w-5 h-5" />
              <span>{product.address || "Location not specified"}</span>
            </div>
          </div>

          {/* Price */}
          <div className="border-t pt-[10px]">
            <h1 className="text-[18px]">
              AED {product.price.toLocaleString()}
            </h1>
          </div>

          {/* Seller Info */}
          <div className="flex items-center justify-between">
            <div className="text-sm">
              <span className="text-[#000000] font-semibold">Seller</span>
              <span className="ml-1 text-[#000000] underline cursor-pointer">
                @{product.user?.name}
              </span>
            </div>
            {/* {product.user?.profile_image && (
              <div className="w-10 h-10 relative rounded-full overflow-hidden bg-gray-100">
                <Image src={product.user.profile_image} alt="Seller" fill className="object-cover" />
              </div>
            )} */}
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-2 gap-3">
            {/* Chat Button */}
            {Number(userId) !== product.user?.id ? (
              <Button
                onClick={handleChatClick}
                className="bg-[#111111] hover:bg-black text-white rounded-none h-12 text-sm font-medium leading-[20px] tracking-[-0.15px]"
              >
                <Image
                  src="/icons/chat.png"
                  alt="Chat"
                  width={256}
                  height={256}
                  className="w-[18.44px] h-[17.44px] mr-[10px]"
                />
                Chat with seller
              </Button>
            ) : (
              <Button disabled className="h-12 bg-gray-200 text-gray-500">
                Your Listing
              </Button>
            )}

            {/* Contact Button */}
            <Button
              variant="default"
              className="bg-[#111111] hover:bg-black text-white rounded-none h-12 text-sm font-medium leading-[20px] tracking-[-0.15px]"
              onClick={() => setShowPhone(!showPhone)}
            >
               <Image
                  src="/icons/phone.png"
                  alt="Phone"
                  width={256}
                  height={256}
                  className="w-[18.44px] h-[17px] mr-[10px]"
                />
              {showPhone ? product.user?.phoneNumber || "No Number" : "Contact details"}
            </Button>
          </div>

          {/* Safety Note */}
          <div className="flex items-center gap-2 text-[12px] font-normal text-[#6A7282] border-b pb-[10px]">
            <AlertCircle className="w-3 h-3 md:w-4 md:h-4 text-solid" />
            <span className="cursor-pointer">
              Learn more about our{" "}
              <span className="hover:text-solid underline underline-offset-2">
                Safety Policy
              </span>
            </span>
          </div>

          {/* Wishlist Button */}
          <Button
            variant="outline"
            className="w-full rounded-none border-[3px] border-[#E9A426] text-yellow-600 text-sm hover:text-yellow-700 h-12 font-medium"
          >
            Wishlist now
          </Button>
        </div>
      </div>

      <LoginDialog
        open={showLoginDialog}
        onOpenChange={setShowLoginDialog}
        description="You must be logged in to start a chat."
      />
    </div>
  )
}
function SpecBox({ label, value }: { label: string; value?: string | number | null }) {

  return (
    <div className="flex flex-col gap-1">
      <span className="text-xs font-normal text-gray-500 tracking-wide">
        {label}
      </span>
      <h1 className="text-[16px] text-[#111111] truncate">
        {value || "-"}
      </h1>
    </div>
  )
}