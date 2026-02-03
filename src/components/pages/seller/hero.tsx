import Image from "next/image";
import { Star, Share2, Check } from "lucide-react";
import { FiMapPin } from "react-icons/fi";

export default function SellerHero() {
  return (
    <div className="bg-white pt-12 pb-[30px] relative">
      <button className="absolute top-8 right-12 flex items-center gap-2 text-gray-500 text-sm hover:text-black transition-colors">
        <Share2 size={18} className="text-[#E9A426]" />
        <span>Share</span>
      </button>

      <div className="flex flex-col items-center">
        <div className="relative w-32 h-32 mb-[16px]">
          <div className="w-full h-full rounded-full overflow-hidden border border-gray-100">
            <Image
              src="/moto-mania.png"
              alt="MotoMania"
              fill
              className="object-cover"
            />
          </div>

          <div className="absolute bottom-0 right-0 bg-[#E9A426] rounded-full w-[39px] h-[39px] flex items-center justify-center shadow-sm">
            <Check
              size={17}
              strokeWidth={3}
              className="text-black"
            />
          </div>
        </div>

        <h1 className="text-2xl font-bold text-[#111111] mb-[10px]">MotoMania</h1>

        {/* Badges */}
        <div className="flex items-center gap-3 mb-[10px]">
          <div className="flex items-center gap-2 bg-[#E9A426] px-3 h-[30px] rounded-full">
            <div className="bg-[#111111] rounded-full p-0.5">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[#E9A426]"><polyline points="20 6 9 17 4 12"></polyline></svg>
            </div>
            <span className="text-xs font-medium text-[#111111] pt-0.5">Verified Seller</span>
          </div>
          <div className="flex items-center gap-1 text-sm text-[#111111]">
            <div className="bg-black text-white w-[22px] h-[22px] rounded-[60px] flex items-center justify-center">
              <FiMapPin size={11} />
            </div>
            <span>UAE, Dubai</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex">
            {[...Array(4)].map((_, i) => (
              <Star key={i} size={20} fill="#E9A426" className="text-[#E9A426]" />
            ))}
            <Star size={20} className="text-[#E9A426]" />
          </div>
          <span className="text-sm font-medium text-[#111111]">4.5 rating</span>
        </div>
      </div>
    </div>
  );
}