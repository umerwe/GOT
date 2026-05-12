"use client";

import { X, Minus, Plus, ShoppingCart } from "lucide-react";
import Image from "@/components/custom/MyImage";
import Link from "next/link";
import { useAppSelector } from "@/store/hooks"
import { toast } from "@/components/ui/toast";
import { useGetConfig } from "@/hooks/useConfig";

interface CartCardProps {
  id: number;
  name: string;
  price: number;
  image: string;
  quantity: number;
  business?: number;
  details?: string[];
  variant?: "cart" | "favorite";
  onQuantityChange?: (id: number, quantity: number) => void;
  onRemove?: (id: number) => void;
  onAction?: (id: number) => void;
}

export default function CartCard({
  id,
  name,
  price,
  image,
  quantity,
  business = 0,
  details,
  variant = "cart",
  onQuantityChange,
  onRemove,
  onAction,
}: CartCardProps) {
  const { data: configData } = useGetConfig();
  const cartItems = useAppSelector((state) => state.cart.items);

  const handleAddToCartClick = () => {
    const isDuplicate = cartItems.some((item) => item.id === id);
    if (isDuplicate) {
      toast({
        title: "Already in Cart",
        variant: "destructive",
      });
      return;
    }

    // 2. Check for Business Mismatch
    const hasDifferentBusiness = cartItems.length > 0 && cartItems.some(item => item.business !== business);
    if (hasDifferentBusiness) {
      toast({
        title: "Business Mismatch",
        description: "You can only add items from the same business to one order. Please clear your cart first.",
        variant: "destructive",
      });
      return;
    }

    // If all checks pass, trigger the action
    onAction?.(id);
  };

  const handleRemove = () => {
    onRemove?.(id);
  };

  return (
    <div className="relative flex flex-col sm:flex-row w-full gap-5 sm:gap-[30px] py-5 pr-0 sm:pr-5 border-b border-gray-100 bg-white">
      <button
        onClick={handleRemove}
        className="absolute right-2 top-7 sm:right-5 sm:top-5 text-gray-400 hover:text-red-500 transition-colors z-10 cursor-pointer"
      >
        <X size={20} />
      </button>

      <Link
        href={`/listing/${id}`}
        className="flex flex-col gap-2 flex-shrink-0 w-full sm:w-[196px]"
      >
        <div className="relative overflow-hidden w-full h-[200px] sm:w-[196px] sm:h-[141px]">
          <Image src={image} alt={name} fill className="object-cover" priority />
        </div>
      </Link>

      <div className="flex flex-1 flex-col justify-between py-1 px-2 sm:px-0">
        <div className="space-y-[10px]">
          <h3 className="text-lg font-bold text-gray-900 leading-tight max-w-[90%] capitalize">
            {name}
          </h3>

          {details && (
            <div className="flex flex-wrap items-center text-sm text-gray-600 gap-y-1">
              {details.map((detail, index) => (
                <h4 key={index} className="flex items-center">
                  {detail}
                  {index < details.length - 1 && <span className="mx-1.5">|</span>}
                </h4>
              ))}
            </div>
          )}

          <h2 className="text-sm font-semibold">AED {price.toLocaleString()}</h2>
        </div>

        <div className="flex flex-wrap items-center justify-between mt-6 gap-4">
          {variant === "cart" ? (
            <div className="flex items-center">
              <button
                onClick={() => onQuantityChange?.(id, quantity - 1)}
                className="w-[30px] h-[30px] border border-[#C5A353] flex items-center justify-center cursor-pointer"
              >
                <Minus size={18} />
              </button>
              <div className="w-8 h-8 flex items-center justify-center font-semibold">
                {quantity}
              </div>
              <button
                onClick={() => onQuantityChange?.(id, quantity + 1)}
                className="w-[30px] h-[30px] border border-[#C5A353] flex items-center justify-center cursor-pointer"
              >
                <Plus size={18} />
              </button>
            </div>
          ) : (
            !!configData?.checkout_enabled ?
            <button
              onClick={handleAddToCartClick}
              className="flex items-center gap-2 text-sm font-bold text-[#E9A426] hover:underline cursor-pointer"
            >
              <ShoppingCart size={18} />
              Add to Cart
            </button> : null
          )}
        </div>
      </div>
    </div>
  );
}