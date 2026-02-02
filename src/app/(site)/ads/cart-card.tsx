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
    <div className="relative flex w-full gap-[30px] py-[20px] pr-[20px] border-b border-gray-100 bg-white">
      {/* Remove Button - Top Right */}
      <button
        onClick={() => onRemove?.(id)}
        className="absolute right-5 top-5 text-gray-800 hover:text-black transition-colors"
      >
        <X size={24} strokeWidth={1.5} />
      </button>

      {/* Left: Brand + Product Image Container */}
      <div className="flex flex-col gap-2 flex-shrink-0" style={{ width: '196px' }}>
        <div className="relative overflow-hidden" style={{ width: '196px', height: '141px' }}>
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
      <div className="flex flex-1 flex-col justify-between py-1">
        <div className="space-y-[10px]">
          <h3 className="text-lg font-bold text-gray-900 leading-tight">
            {name}
          </h3>

          {/* Details/Metadata */}
          {details && (
            <div className="flex items-center text-sm text-gray-600">
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
            <h2 className="text-sm">
              AED {price.toLocaleString()}
            </h2>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between mt-6">
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
              <Heart size={16} className="stroke-3" />
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