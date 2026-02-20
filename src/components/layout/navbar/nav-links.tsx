"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { NavLinksProps } from "@/types/navbar";

const NavLinks = ({ isMobile = false, textColor, onClose }: NavLinksProps) => {
    const pathname = usePathname();

    const links = [
        { name: "Home", href: "/" },
        { name: "Categories", href: "/ads/all", match: "/ads" },
    ];

    return (
        <div
            className={cn(
                isMobile ? "flex flex-col gap-4" : "hidden sm:flex items-center gap-[40px]",
                "text-base font-medium"
            )}
        >
            {links.map((link) => {
                const isActive = link.match
                    ? pathname.startsWith(link.match)
                    : pathname === link.href;

                return (
                    <Link
                        key={link.name}
                        href={link.href}
                        onClick={onClose}
                        className={cn(
                            "transition-colors hover:text-solid",
                            isMobile ? "text-black" : textColor,
                            isActive && "text-solid font-medium"
                        )}
                    >
                        {link.name}
                    </Link>
                );
            })}
        </div>
    );
};

export default NavLinks;