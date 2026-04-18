"use client"

import { Heart, ShoppingCart, Bell } from "lucide-react";
import { cn } from "@/lib/utils";
import { NavIconsProps } from "@/types/navbar";
import { useAppSelector } from "@/store/hooks";
import { useEffect, useState } from "react";
import LoginDialog from "@/components/dialogs/loginDialog";
import { useGetWishlist } from "@/hooks/favorites/useWishlist";
interface ExtendedNavIconsProps extends NavIconsProps {
    onClose?: () => void;
}

const NavIcons = ({
    isLoading,
    cartCount,
    textColor,
    isHome,
    handleProtectedAction,
    onClose,
}: ExtendedNavIconsProps) => {
    const {data} = useGetWishlist();
    const favoriteCount = data?.pagination?.wishlist_count || 0;
    const [unreadCount, setUnreadCount] = useState<number>(0);
    const [isLoginDialogOpen, setIsLoginDialogOpen] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) return;

        fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/notification-list`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({}),
        })
            .then((res) => res.json())
            .then((data) => {
                if (data?.all_unread_count !== undefined) {
                    setUnreadCount(data.all_unread_count);
                }
            })
            .catch((err) => console.error("NavIcons Notification Error:", err));
    }, []);

    const handleClick = (path: string) => {
        const token = localStorage.getItem("token");
        if (!token) {
            setIsLoginDialogOpen(true);
            return;
        }
        handleProtectedAction(path);
        if (onClose) onClose();
    };

    return (
        <div className="flex items-center gap-4 flex-shrink-0">
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

            <div
                onClick={() => handleClick("/notifications")}
                className="relative cursor-pointer"
            >
                <Bell className={cn("w-5 h-5", textColor)} />
                {unreadCount > 0 && (
                    <span
                        className={cn(
                            "absolute -top-1.5 -right-[9px] border-[2px] text-[7px] font-medium rounded-full w-4 h-4 flex items-center justify-center bg-[#E9A426]",
                            isHome
                                ? "text-black border-black sm:text-white sm:border-white"
                                : "text-black border-black"
                        )}
                    >
                        {unreadCount}
                    </span>
                )}
            </div>

            {/* Login Dialog Component */}
            <LoginDialog
                open={isLoginDialogOpen} 
                onOpenChange={setIsLoginDialogOpen} 
            />
        </div>
    );
};

export default NavIcons;