"use client"

import { Heart, ShoppingCart, Bell } from "lucide-react";
import { cn } from "@/lib/utils";
import ReactCountryFlag from "react-country-flag";
import { NavIconsProps } from "@/types/navbar";
import { useAppSelector } from "@/store/hooks"; // Import selector
import Link from "next/link";

// Extend the interface locally or ensure NavIconsProps includes onClose
interface ExtendedNavIconsProps extends NavIconsProps {
    onClose?: () => void;
}

const NavIcons = ({
    isLoading,
    cartCount,
    textColor,
    isHome,
    handleProtectedAction,
    onClose, // Destructure onClose
}: ExtendedNavIconsProps) => {
    // Get the favorites count from Redux
    const favoriteCount = useAppSelector((state) => state.favorites.items.length);

    const handleClick = (path: string) => {
        handleProtectedAction(path);
        if (onClose) onClose(); // Close menu if the function exists
    };

    return (
        <div className="flex items-center gap-4 flex-shrink-0">
            {/* <div className="flex-shrink-0 overflow-hidden">
                <ReactCountryFlag
                    countryCode="AE"
                    svg
                    style={{
                        width: "20px",
                        height: "15px",
                    }}
                    title="UAE"
                />
            </div> */}

            {/* Cart Icon */}
            <div
                onClick={() => handleClick("/cart")}
                className="relative cursor-pointer hover:opacity-80"
            >
                <ShoppingCart className={cn("w-[19.5px] h-[19.5px] stroke-[2.5]", textColor)} />
                {!isLoading && cartCount > 0 && (
                    <span className="absolute -top-1.5 -right-2 bg-[#E9A426] text-black text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
                        {cartCount}
                    </span>
                )}
            </div>

            {/* Favorites Icon */}
            <div
                onClick={() => handleClick("/favourites")}
                className="relative cursor-pointer hover:opacity-80"
            >
                <Heart className={cn("w-[19.5px] h-[19.5px] stroke-[2.5]", textColor)} />
                {favoriteCount > 0 && (
                    <span className="absolute -top-1.5 -right-2 bg-[#E9A426] text-black text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
                        {favoriteCount}
                    </span>
                )}
            </div>

            {/* Notifications Icon */}
            <Link
                href="/notifications"
                onClick={() => onClose?.()} // Close menu when notification is clicked
                className="relative cursor-pointer">
                <Bell className={cn("w-5 h-5", textColor)} />
                <span
                    className={cn(
                        "absolute -top-1.5 -right-[9px] border-[2px] text-[7px] font-medium rounded-full w-4 h-4 flex items-center justify-center",
                        isHome
                            ? "text-black border-black sm:text-white sm:border-white"
                            : "text-black border-black"
                    )}
                >
                    3
                </span>
            </Link>
        </div>
    );
};

export default NavIcons;