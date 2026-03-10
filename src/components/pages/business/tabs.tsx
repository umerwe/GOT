"use client"

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

const tabs = ["Motorcycles", "Gear", "Accessories"];

export default function SellerTabs() {
    const router = useRouter();
    const searchParams = useSearchParams();

    const currentTabInUrl = searchParams.get("tab");
    const [activeTab, setActiveTab] = useState(
        tabs.find(t => t.toLowerCase() === currentTabInUrl?.toLowerCase()) || "Motorcycles"
    );

    const handleTabClick = (tab: string) => {
        setActiveTab(tab);
        router.push(`?tab=${tab.toLowerCase()}`, { scroll: false });
    };

    return (
        <div className="w-full bg-white">
            <div className="grid grid-cols-3 px-[21px] relative">
                {tabs.map((tab) => {
                    const isActive = activeTab === tab;

                    return (
                        <button
                            key={tab}
                            onClick={() => handleTabClick(tab)}
                            className={`py-[10px] text-[16px] font-bold transition-all relative flex justify-center items-center border-b-[3px] ${isActive
                                    ? "text-[#E9A426] border-[#E9A426]"
                                    : "text-black border-gray-200 hover:text-[#E9A426]"
                                }`}
                        >
                            {tab}
                        </button>
                    );
                })}
            </div>
        </div>
    );
}