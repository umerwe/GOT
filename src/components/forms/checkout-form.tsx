"use client";

import { CreditCard, Landmark, Info } from "lucide-react";
import Image from "next/image";

export default function PaymentForm() {
  return (
    <div className="border border-gray-200 p-[30px]">
      <h2 className="mb-[5px]">Payment</h2>
      <p className="text-gray-500 text-lg mb-[20px] border-b border-gray-900 pb-[20px]">
        Add your payment method details below
      </p>

      <div className="space-y-[20px]">
        {/* Method Selection */}
        <div className="flex gap-4 w-[380px]">
          <button className="flex-1 flex flex-col gap-2 p-4 border-2 border-[#F2A416] bg-white text-left w-[140px]">
            <CreditCard className="text-gray-600" size={24} />
            <span className="font-medium text-[#F2A416]">Card</span>
          </button>
          <button className="flex-1 flex flex-col gap-2 p-4 border border-gray-200 bg-white text-left hover:border-gray-300 w-[140px]">
            <Landmark className="text-gray-600" size={24} />
            <span className="font-medium text-gray-800">Bank account</span>
          </button>
        </div>

        {/* Form Fields */}
        <div className="space-y-[20px]">
          <div className="space-y-[20px]">
            <label className="text-gray-500 font-medium mb-[5px]">Card number</label>
            <div className="relative">
              <input
                type="text"
                className="w-full h-[54px] px-4 border border-gray-300 focus:outline-none focus:border-gray-900"
              />
              <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-2">
                <Image src="/payment/visa.png" alt="Visa" width={30} height={10} className="opacity-50" />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-[20px]">
              <label className="text-gray-500 font-medium mb-[5px]">Expiration date (MM/YY)</label>
              <input type="text" className="w-full h-[54px] px-4 border border-gray-300" />
            </div>
            <div className="space-y-[20px]">
              <label className="text-gray-500 font-medium mb-[5px]">Security code</label>
              <div className="relative">
                <input type="text" className="w-full h-[54px] px-4 border border-gray-300" />
                <Landmark className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-300" size={20} />
              </div>
            </div>
          </div>

          <label className="flex items-center gap-3 cursor-pointer">
            <input type="checkbox" defaultChecked className="w-5 h-5 accent-[#F2A416]" />
            <span className="text-gray-700 font-medium">Save my information for faster checkout</span>
          </label>

          <input
            type="email"
            placeholder="email@example.com"
            className="w-full h-[54px] px-4 border border-gray-300"
          />

          <div className="relative flex items-center border border-gray-300 h-[54px]">
            <div className="flex items-center gap-2 px-4 border-r border-gray-200 h-full">
              <span className="text-lg">🇦🇪</span>
              <span className="text-gray-400">▼</span>
            </div>
            <input type="tel" className="flex-1 px-4 focus:outline-none" placeholder="+971 585300320" />
          </div>

          <p className="text-gray-400 text-sm leading-relaxed">
            By selecting to save your info, you agree to create an account subject to Link's Terms and Privacy Policy.
          </p>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-[20px] ">
              <label className="text-gray-500 font-medium mb-[5px]">Country</label>
              <select className="w-full h-[54px] px-4 border border-gray-300 appearance-none bg-white">
                <option>United Arab Emirates</option>
              </select>
            </div>
            <div className="space-y-[20px]">
              <label className="text-gray-500 font-medium mb-[5px]">Postal Code</label>
              <input type="text" placeholder="00000" className="w-full h-[54px] px-4 border border-gray-300" />
            </div>
          </div>

          <button className="w-full h-[64px] bg-[#F2A416] hover:bg-[#D99314] text-gray-900 font-semibold text-sm mt-4 transition-colors">
            Confirm payment
          </button>
        </div>
      </div>
    </div>
  );
}