"use client";

import { Heart, X, Minus, Plus } from "lucide-react";
import Image from "next/image";

interface CartCardProps {
  id: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
  details?: string[];
  onQuantityChange?: (id: string, quantity: number) => void;
  onRemove?: (id: string) => void;
  onAddToWishlist?: (id: string) => void;
}

export default function CartCard({
  id,
  name,
  price,
  image,
  quantity,
  details,
  onQuantityChange,
  onRemove,
  onAddToWishlist,
}: CartCardProps) {
  const handleQuantityChange = (newQuantity: number) => {
    if (newQuantity >= 1 && onQuantityChange) {
      onQuantityChange(id, newQuantity);
    }
  };

  return (
    <div className="relative flex flex-col sm:flex-row w-full gap-5 sm:gap-[30px] py-5 pr-0 sm:pr-5 border-b border-gray-100 bg-white">
      {/* Remove Button - Positioned consistently on both mobile/desktop */}
      <button
        onClick={() => onRemove?.(id)}
        className="absolute right-2 top-7 sm:right-5 sm:top-5 text-white sm:text-gray-800 hover:text-black transition-colors z-10"
      >
        <X size={24} strokeWidth={1.5} />
      </button>

      {/* Left: Product Image Container */}
      <div className="flex flex-col gap-2 flex-shrink-0 w-full sm:w-[196px]">
        {/* Responsive sizing: Full width on mobile, 196x141 on desktop */}
        <div className="relative overflow-hidden w-full h-[200px] sm:w-[196px] sm:h-[141px]">
          <Image
            src={image}
            alt={name}
            fill
            className="object-cover"
            priority
          />
        </div>
      </div>

      {/* Right: Content Section */}
      <div className="flex flex-1 flex-col justify-between py-1 px-2 sm:px-0">
        <div className="space-y-[10px]">
          <h3 className="text-lg font-bold text-gray-900 leading-tight max-w-[90%] sm:max-w-none">
            {name}
          </h3>

          {/* Details/Metadata */}
          {details && (
            <div className="flex flex-wrap items-center text-sm text-gray-600 gap-y-1">
              {details.map((detail, index) => (
                <h4 key={index} className="flex items-center">
                  {detail}
                  {index < details.length - 1 && (
                    <span className="mx-1.5 text-gray-600">|</span>
                  )}
                </h4>
              ))}
            </div>
          )}

          {/* Price */}
          <div>
            <h2 className="text-sm font-semibold">
              AED {price.toLocaleString()}
            </h2>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex flex-wrap items-center justify-between mt-6 gap-4">
          {/* Quantity Selector */}
          <div className="flex items-center">
            <button
              onClick={() => handleQuantityChange(quantity - 1)}
              className="w-[30px] h-[30px] border border-[#C5A353] flex items-center justify-center text-gray-900 hover:bg-gray-50 transition-colors"
            >
              <Minus size={18} />
            </button>
            <div className="w-8 h-8 flex items-center justify-center font-semibold text-gray-800">
              {quantity}
            </div>
            <button
              onClick={() => handleQuantityChange(quantity + 1)}
              className="w-[30px] h-[30px] border border-[#C5A353] flex items-center justify-center text-gray-900 hover:bg-gray-50 transition-colors"
            >
              <Plus size={18} />
            </button>
          </div>

          {/* Add to Wishlist */}
          <button
            onClick={() => onAddToWishlist?.(id)}
            className="flex items-center gap-[10px] group"
          >
            <div className="w-8 h-8 rounded-full border-2 border-gray-400 flex items-center justify-center text-gray-400 group-hover:border-gray-500 group-hover:text-gray-500 transition-all">
              <Heart size={17} className="stroke-3" />
            </div>
            <span className="text-sm font-semibold text-gray-900">
              Add to Wishlist
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}