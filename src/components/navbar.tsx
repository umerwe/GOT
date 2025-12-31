"use client";

import { useState } from "react";
import { Bell, Menu, X, Heart } from "lucide-react";
import Link from "next/link";
import { useAppSelector } from "@/store/hooks";
import { usePathname, useRouter } from "next/navigation";
import { UserMenu } from "./user-menu";
import { cn } from "@/lib/utils";
import LoginDialog from "@/utils/loginDialog";
import Image from "next/image";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const [showLoginDialog, setShowLoginDialog] = useState(false);
  const isAuth = useAppSelector((state) => state?.auth?.token);
  const configData = useAppSelector((state) => state.config.data);

  const isHome = pathname === "/";
  const isAds = pathname.startsWith("/ads");
  const isAdDetail = pathname.startsWith("/listing");;
  const isAuthPage = pathname.startsWith("/auth");
  const textColor = isHome ? "text-[#111111] sm:text-white" : "text-[#111111]";

  const getLinkClasses = (path: string, isMobile: boolean, exact = true) => {
    const isActive = exact ? pathname === path : pathname.startsWith(path);
    return cn(
      "hover:text-yellow-500 transition-colors relative pb-1",
      isMobile ? "text-black" : textColor,
      isActive && "text-yellow-500"
    );
  };

  function handleClick() {
    return isAuth ? router.push("post-ad") : setShowLoginDialog(true);
  }

  const closeMenu = () => setIsMenuOpen(false);

  const NavLinks = ({ isMobile = false }) => (
    <div
      className={cn(
        isMobile ? "flex flex-col gap-4" : "hidden sm:flex items-center gap-[40px]",
        "text-[16px] font-medium"
      )}
    >
      <Link
        href="/"
        className={getLinkClasses("/", isMobile)}
        onClick={() => isMobile && setIsMenuOpen(false)}
      >
        Home
      </Link>
      <Link
        href="/ads/all"
        className={getLinkClasses("/ads", isMobile, false)}
        onClick={() => isMobile && setIsMenuOpen(false)}
      >
        Categories
      </Link>
    </div>
  );

  const UtilityIcons = () => (
    <div className="flex items-center gap-4">
      {/* UAE Flag Icon */}
      <div className="w-4.5 h-3 relative overflow-hidden rounded-[2px] shadow-sm flex-shrink-0">
        <div className="absolute left-0 top-0 bottom-0 w-[25%] bg-[#FF0000] z-10" />
        <div className="absolute right-0 top-0 h-[33.33%] w-[75%] bg-[#00732F]" />
        <div className="absolute right-0 top-[33.33%] h-[33.33%] w-[75%] bg-white" />
        <div className="absolute right-0 bottom-0 h-[33.33%] w-[75%] bg-black" />
      </div>

      <Link href="#" className="hover:opacity-80 transition-opacity">
        <Heart className={cn("w-[19.5px] h-[19.5px] stroke-[2.5]", textColor)} />
      </Link>

      <Link href="#" className="relative hover:opacity-80 transition-opacity inline-block">
        <Bell className={`w-5 h-5 ${textColor}`} />
        <span className={`absolute -top-1.5 -right-2 z-10 bg-transparent
        border-[2px] text-[6.06px] font-medium
         rounded-full w-4 h-4 flex items-center justify-center ${isHome ? "text-[#111111] sm:text-white sm:border-white" : "text-[#111111] border-black"}`}>
          3
        </span>
      </Link>
    </div>
  );

  return (
    <nav
      className={cn(
        "w-full top-0 sm:px-6 lg:pl-[49px] lg:pr-[50.42px] border-b-2 z-[500] transition-colors duration-300",

        isHome
          ? "bg-transparent border-transparent absolute"
          : isAuthPage
            ? "bg-[#F3F4F6] border-gray-100 sticky"
            : "bg-white border-gray-100 sticky"
      )}
    >

      <div className="flex items-start justify-between gap-5 pr-[16px] sm:pr-0">
        <div className="flex items-center gap-3 text-base sm:text-xl font-semibold flex-shrink-0">
          <Link href="/" className="relative flex items-center justify-center">
            {configData?.site_logo ? (
              <Image
                src={configData?.site_logo}
                width={256}
                height={256}
                alt="logo-img"
                className={`object-contain -rotate-8 ${isHome ? "w-[144px] h-[134.39px]" : "w-[108px] h-[100.79px]"
                  }`}
              />
            ) : (
              <div className="w-[80px] h-[87px] bg-gray-200 animate-pulse rounded" />
            )}
          </Link>
        </div>
        <div className="mt-[45.31px] mb-[31.48px]">
          {(isAds || isAdDetail) && <NavLinks />}
        </div>

        {/* Desktop Actions */}
        <div className="hidden sm:flex flex-col gap-[28px] mt-[11px]">
          <div className={cn("flex items-center gap-3 text-xs tracking-wide", textColor)}>
            <span onClick={handleClick} className="hover:opacity-80 transition-opacity cursor-pointer">
              Place an Ad
            </span>
            <span className="opacity-40">|</span>
            <Link href="#" className="hover:opacity-80 transition-opacity">
              Help
            </Link>
            <span className="opacity-40 text-[10px]">|</span>
            {!isAuth ? (
              <Link href="/auth/login" className="hover:opacity-80 transition-opacity">
                Sign In
              </Link>
            ) : (
              <UserMenu />
            )}
            <LoginDialog
              open={showLoginDialog}
              onOpenChange={setShowLoginDialog}
              description="You must be logged in to start a post ad."
            />
          </div>

          {
            (isHome || isAds || isAdDetail) &&
            <div className="flex items-center gap-5">
              <Link href="/auth/login" className={cn("text-[16px] font-medium hover:opacity-80", textColor)}>
                Account
              </Link>
              <UtilityIcons />
            </div>
          }
        </div>

        {/* Mobile Toggle and Profile - KEPT OUTSIDE MENU */}
        <div className="flex sm:hidden items-center gap-4 my-auto">
          {isAuth && <UserMenu />}
          <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="cursor-pointer">
            {isMenuOpen ? (
              <X className={`w-6 h-6 ${textColor}`} />
            ) : (
              <Menu className={`w-6 h-6 ${textColor}`} />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {isMenuOpen && (
        <div className="block sm:hidden bg-white border-t border-gray-100 animate-in slide-in-from-top-2 duration-200">
          <div className="flex flex-col gap-4 py-4 px-4">
            {/* 1. Home & Categories */}
            <NavLinks isMobile />

            {/* 2. Place an Ad, Help, Sign In/Account (From Desktop Top Bar) */}
            <div className="flex flex-col gap-4 border-t border-gray-50 pt-4 text-[16px] font-medium text-black">
              <span
                onClick={() => {
                  handleClick();
                  closeMenu();
                }}
                className="hover:text-yellow-500 cursor-pointer"
              >
                Place an Ad
              </span>

              <Link href="#" onClick={() => setIsMenuOpen(false)} className="hover:text-yellow-500">
                Help
              </Link>
              {!isAuth ? (
                <Link href="/auth/login" onClick={() => setIsMenuOpen(false)} className="hover:text-yellow-500">
                  Sign In
                </Link>
              ) : (
                <Link href="/auth/login" onClick={() => setIsMenuOpen(false)} className="hover:text-yellow-500">
                  Account
                </Link>
              )}
            </div>

            {/* 3. Utility Icons (Heart, Bell, Flag) */}
            <div className="pt-2">
              <UtilityIcons />
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;