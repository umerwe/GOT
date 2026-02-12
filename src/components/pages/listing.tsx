"use client"

import Image from "next/image"
import { Button } from "@/components/ui/button"
import { capitalizeWords } from "@/utils/capitalizeWords"
import LoginDialog from "@/utils/loginDialog"
import { useState } from "react"
import { useAppDispatch, useAppSelector } from "@/store/hooks"
import { useRouter } from "next/navigation"
import {
  MapPin,
  Phone,
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  Heart,
  Flame
} from "lucide-react";
import { BsChatDotsFill } from "react-icons/bs";

import { cn } from "@/lib/utils"
import FeaturesSection from "./listing/features-section"
import { CartItem } from "@/types/cart"
import { addToCart } from "@/store/slices/CartSlice"
import { toast } from "../ui/toast"


interface ProductDetailsProps {
  product: Product
}

export default function Listing({ product }: ProductDetailsProps) {
  const dispatch = useAppDispatch();
  const cartItems = useAppSelector((state) => state.cart.items); // Accessing current cart items
  const [activeImage, setActiveImage] = useState<string | null>(
    product?.product_images?.[0] ?? null
  )
  const [showLoginDialog, setShowLoginDialog] = useState(false)
  const [showPhone, setShowPhone] = useState(false)

  const { token, userId } = useAppSelector((state) => state?.auth)
  const router = useRouter();

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

  const handleContactClick = () => {
    const phoneNumber = product.seller?.phoneNumber;

    if (!phoneNumber) {
      toast({
        title: "Number not available",
        description: "The seller has not provided a contact number.",
        variant: "destructive",
      });
      return;
    }

    // Clean the phone number (remove +, spaces, dashes)
    const cleanNumber = phoneNumber.replace(/\D/g, "");

    // Open WhatsApp in a new tab
    window.open(`https://wa.me/${cleanNumber}`, "_blank");
  };
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

  const handleAddToCart = () => {
    if (!token) {
      setShowLoginDialog(true)
      return
    }
    const currentVendorId = product.seller?.id || 0;

    // 1. Check for Duplicate Items
    const isDuplicate = cartItems.some(item => item.id === product.id);
    if (isDuplicate) {
      toast({
        title: "Already in Cart",
        description: "This item is already in your cart.",
        variant: "destructive",
      });
      return;
    }

    // 2. Check for Different Vendor
    const hasDifferentVendor = cartItems.length > 0 && cartItems.some(item => item.vendor !== currentVendorId);
    if (hasDifferentVendor) {
      toast({
        title: "Vendor Mismatch",
        description: "You can only add items from the same vendor to one order. Please clear your cart first.",
        variant: "destructive",
      });
      return;
    }

    // 3. Prepare Item and Add to Cart
    const item: CartItem = {
      id: product.id || 0,
      name: product.title,
      price: product.price,
      image: product.product_images?.[0] || "/placeholder.svg",
      quantity: 1,
      vendor: currentVendorId,
      details: [
        product.manufacturing_year,
        product.engine_size,
        product.usage
      ].filter(Boolean) as string[],
    };

    dispatch(addToCart(item));
    toast({
      title: "Item added to cart successfully.",
    });
    router.push("/cart");
  };

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

          <FeaturesSection />

          {/* Specs Grid */}
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
            <div className="text-gray-600 text-sm font-normal first-letter:uppercase">
              {product.description}
            </div>
          </div>
        </div>

        {/* --- RIGHT COLUMN: Details & Actions --- */}
        <div className="lg:col-span-1 space-y-[10px] sm:px-[24px]">

          {/* Popularity Badge */}
          <div className="flex items-center gap-1.5 text-[#636E7E] text-sm">
            <Flame size={16} className="text-[#FF7A00]" />
            <span>Popular: Recently 66 wishlisted this item</span>
          </div>

          {/* Tags & Wishlist Icon */}
          <div className="flex justify-between items-center py-[5px]">
            <div className="flex gap-2">
              <span className="bg-[#E9A426] text-[#111111] px-3 h-[22px] flex items-center justify-center text-xs rounded">
                Featured
              </span>

              <span className="bg-[#E9A426] text-[#111111] px-3 h-[22px] flex items-center justify-center text-xs rounded">
                Verified
              </span>
            </div>

            <button
              className="flex items-center gap-[10px] group"
            >
              <div className="w-8 h-8 rounded-full border-2 border-gray-400 flex items-center justify-center text-gray-400 group-hover:border-gray-500 group-hover:text-gray-500 transition-all">
                <Heart size={16} className="stroke-3" />
              </div>
            </button>
          </div>

          {/* Title Header */}
          <div className="space-y-[6px]">
            <h3 className="text-[22px] font-bold leading-[1.2] tracking-tight text-[#111111]">
              {capitalizeWords(product?.title)}
            </h3>

            <div className="text-[13px] text-[#636E7E] flex flex-wrap gap-x-2">
              <span>{product.brand?.title || "None"}</span>
              <span>•</span>
              <span>{product.condition || "Good condition"}</span>
              <span>•</span>
              <span>GCC Specs</span>
            </div>

            <div className="flex gap-1.5 text-[#636E7E] text-sm items-start">
              <MapPin className="w-4 h-4 mt-1" />
              <span>{product.address || "Location not specified"}</span>
            </div>
          </div>

          {/* Price */}
          <div className="flex justify-between items-baseline border-t border-gray-100 pt-[15px]">
            <h1 className="text-[24px] font-bold text-[#111111]">
              AED {product.price.toLocaleString()}
            </h1>
            <span className="text-[#C17C00] font-medium text-sm cursor-pointer underline underline-offset-2">Need financing?</span>
          </div>

          {/* Seller Info */}
          <div className="text-sm flex items-center justify-between">
            <div>
              <span className="text-[#111111] font-semibold">Seller: </span>
              <span className="text-[#111111] font-semibold cursor-pointe">
                {product.seller?.name}
              </span>
            </div>
            <Image
              src={product.seller?.profile_image || ""}
              alt={product.seller?.name || ""}
              width={55}
              height={50}
              className=""
            />
          </div>

          {/* Action Buttons */}
          <div className={`grid ${product?.seller?.user_type !== "vendor" ? "grid-cols-2" : "grid-cols-1"} gap-3`}>
            {product?.seller?.user_type !== "vendor" && (
              <Button
                onClick={handleChatClick}
                className="bg-[#111111] hover:bg-black text-white rounded-none h-[54px] text-sm font-medium w-full"
              >
                <BsChatDotsFill className="w-[18.5px] h-[17px] mr-2" />
                Chat with seller
              </Button>
            )}

            <Button
              variant="default"
              className="bg-[#111111] hover:bg-black text-white rounded-none h-[54px] text-sm font-medium w-full"
              onClick={handleContactClick}
            >
              <Phone size={20} className="mr-2" fill="white" />
              Contact details
            </Button>
          </div>

          {/* Safety Note */}
          <div className="flex items-center gap-2 text-[13px] text-[#636E7E] border-b border-gray-100 pb-[15px]">
            <AlertCircle size={16} className="text-[#E9A426]" />
            <span>
              Learn more about our{" "}
              <span className="underline cursor-pointer">Safety Policy</span>
            </span>
          </div>

          {/* Wishlist Button */}
          {
            product.seller?.user_type === "vendor" &&
            <Button
              variant="outline"
              onClick={handleAddToCart}
              className="w-full cursor-pointer rounded-none border-3 border-[#E9A426] text-[#E9A426] hover:bg-orange-50/30 hover:text-[#E9A426]/80 text-base h-[54px] font-medium"
            >
              Add to Cart
            </Button>
          }

          {/* Finance Section */}
          <Image
            src="/details-banner1.png"
            alt="Finance Banner"
            width={400}
            height={80}
            className="w-full"
          />

          {/* Advertisement Space */}
          <Image
            src="/details-banner2.png"
            alt="Advertisement Banner"
            width={400}
            height={80}
            className="w-full"
          />
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
      <span className="text-xs font-normal text-gray-500 tracking-wide uppercase">
        {label}
      </span>
      <h1 className="text-[16px] font-semibold text-[#111111] truncate">
        {value || "-"}
      </h1>
    </div>
  )
}