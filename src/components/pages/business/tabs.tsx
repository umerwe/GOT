"use client"

import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";

const tabs = ["Motorbike", "Gear", "Accessories"];

export default function SellerTabs() {
    const router = useRouter();
    const searchParams = useSearchParams();

    const currentTabInUrl = searchParams.get("tab");

    // Fix: Match the URL param to the display name in the tabs array
    const [activeTab, setActiveTab] = useState(() => {
        if (currentTabInUrl === "motor_bike") return "Motorbike";
        return tabs.find(t => t.toLowerCase() === currentTabInUrl?.toLowerCase()) || "Motorbike";
    });

    // Optional: Keep state in sync if URL changes via back/forward buttons
    useEffect(() => {
        if (currentTabInUrl === "motor_bike") {
            setActiveTab("Motorbike");
        } else if (currentTabInUrl) {
            const found = tabs.find(t => t.toLowerCase() === currentTabInUrl.toLowerCase());
            if (found) setActiveTab(found);
        }
    }, [currentTabInUrl]);

    const handleTabClick = (tab: string) => {
        setActiveTab(tab);
        const urlParam = tab === "Motorbike" ? "motor_bike" : tab.toLowerCase();
        router.push(`?tab=${urlParam}`, { scroll: false });
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