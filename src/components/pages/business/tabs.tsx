"use client"

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

const tabs = ["Motorbike", "Gear", "Accessories"];

export default function SellerTabs() {
    const router = useRouter();
    const searchParams = useSearchParams();

    const currentTabInUrl = searchParams.get("tab");
    const [activeTab, setActiveTab] = useState(
        tabs.find(t => t.toLowerCase() === currentTabInUrl?.toLowerCase()) || "motor_bike"
    );

    const handleTabClick = (tab: string) => {
        setActiveTab(tab);
        if (tab.toLowerCase() === "motorbike") {
            router.push(`?tab=motor_bike`, { scroll: false });
        } else {
            router.push(`?tab=${tab.toLowerCase()}`, { scroll: false });
        }
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