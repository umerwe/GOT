import { Heart, ShoppingCart, Bell } from "lucide-react";
import { cn } from "@/lib/utils";
import ReactCountryFlag from "react-country-flag";
import { NavIconsProps } from "@/types/navbar";

const NavIcons = ({
    mounted,
    cartCount,
    textColor,
    isHome,
    handleProtectedAction,
}: NavIconsProps) => {
    return (
        <div className="flex items-center gap-4 flex-shrink-0">
            <div className="flex-shrink-0 overflow-hidden">
                <ReactCountryFlag
                    countryCode="AE"
                    svg
                    style={{
                        width: "20px",
                        height: "15px",
                    }}
                    title="UAE"
                />
            </div>

            {/* Cart Icon */}
            <div
                onClick={() => handleProtectedAction("/cart")}
                className="relative cursor-pointer hover:opacity-80"
            >
                <ShoppingCart className={cn("w-[19.5px] h-[19.5px] stroke-[2.5]", textColor)} />
                {mounted && cartCount > 0 && (
                    <span className="absolute -top-1.5 -right-2 bg-[#E9A426] text-blacky text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
                        {cartCount}
                    </span>
                )}
            </div>

            <Heart className={cn("w-[19.5px] h-[19.5px] stroke-[2.5] cursor-pointer", textColor)} />

            <div className="relative cursor-pointer">
                <Bell className={cn("w-5 h-5", textColor)} />
                <span
                    className={cn(
                        "absolute -top-1.5 -right-[9px] border-[2px] text-[7px] font-medium rounded-full w-4 h-4 flex items-center justify-center",
                        isHome
                            ? "text-blacky border-blacky sm:text-white sm:border-white"
                            : "text-blacky border-blacky"
                    )}
                >
                    3
                </span>
            </div>
        </div>
    );
};

export default NavIcons;