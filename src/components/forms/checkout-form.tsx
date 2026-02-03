"use client";

import { CreditCard, Landmark, ChevronDown } from "lucide-react";
import Image from "next/image";
import { Label } from "../ui/label";
import { CiCreditCard1 } from "react-icons/ci";

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
            <Label>Card number</Label>
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
              <Label>Expiration date (MM/YY)</Label>
              <input type="text" className="w-full h-[54px] px-4 border border-gray-300" />
            </div>
            <div className="space-y-[20px]">
              <Label>Security code</Label>
              <div className="relative">
                <input type="text" className="w-full h-[54px] px-4 border border-gray-300" />
                <CiCreditCard1 className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-500" size={28} />
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
            className="w-full h-[54px] px-2.5 border text-gray-600 border-gray-300 font-medium placeholder:text-gray-500"
          />

          <div className="relative flex items-center border border-gray-300 h-[54px]">
            <div className="flex items-center gap-2 px-4 border-r border-gray-200 h-full">
              <div className="w-4.5 h-3 relative overflow-hidden rounded-[2px] shadow-sm flex-shrink-0">
                <div className="absolute left-0 top-0 bottom-0 w-[25%] bg-[#FF0000] z-10" />
                <div className="absolute right-0 top-0 h-[33.33%] w-[75%] bg-[#00732F]" />
                <div className="absolute right-0 top-[33.33%] h-[33.33%] w-[75%] bg-white" />
                <div className="absolute right-0 bottom-0 h-[33.33%] w-[75%] bg-black" />
              </div>
              <ChevronDown className="w-4 h-4 text-gray-400" />
            </div>
            <input type="tel" className="flex-1 px-4 focus:outline-none" placeholder="+971 585300320" />
          </div>

          <p className="text-gray-400 text-sm leading-relaxed">
            By selecting to save your info, you agree to create an account subject to Link&apos;s Terms and Privacy Policy.
          </p>

          {/* Form Fields - Country and Postal Code */}
          <div className="grid grid-cols-[1.8fr_1fr] gap-4">
            <div className="space-y-[10px]">
              <Label>Country</Label>
              <div className="relative">
                <select className="w-full h-[54px] px-4 border border-gray-300 appearance-none bg-white focus:outline-none focus:border-gray-900">
                  <option>United Arab Emirates</option>
                </select>
                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                  <ChevronDown className="w-4 h-4 text-gray-400" />
                </div>
              </div>
            </div>

            <div className="space-y-[10px]">
              <Label>Postal Code</Label>
              <input
                type="text"
                placeholder="00000"
                className="w-full h-[54px] px-4 border border-gray-300 focus:outline-none focus:border-gray-900"
              />
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