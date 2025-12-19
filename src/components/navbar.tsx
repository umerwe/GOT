"use client";

import { useState } from "react";
import { Bell, Menu, X, Heart } from "lucide-react";
import { Button } from "./ui/button";
import Link from "next/link";
import { useAppSelector } from "@/store/hooks";
import { usePathname, useRouter } from "next/navigation";
import { UserMenu } from "./user-menu";
import { cn } from "@/lib/utils";
import Logo from "./logo";
import LoginDialog from "@/utils/loginDialog";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const [showLoginDialog, setShowLoginDialog] = useState(false)
  const isAuth = useAppSelector((state) => state.auth.token);
  const configData = useAppSelector((state) => state.config.data);

  const isHome = pathname === "/";
  const textColor = isHome ? "text-white" : "text-black";

  const getLinkClasses = (path: string, isMobile: boolean, exact = true) => {
    const isActive = exact ? pathname === path : pathname.startsWith(path);
    return cn(
      "hover:text-yellow-500 transition-colors relative pb-1",
      isMobile ? "text-black" : textColor,
      isActive && "text-yellow-500"
    );
  };

  function handleClick() {
    return isAuth ? router.push("post-ad") : setShowLoginDialog(true)
  }

  const NavLinks = ({ isMobile = false }) => (
    <div className={cn(
      isMobile ? "flex flex-col gap-4" : "hidden sm:flex items-center gap-6 text-sm font-medium"
    )}>
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

  const UtilityIcons = ({ showMobileMessage = false }) => (
    <div className="flex items-center gap-4">
      {/* UAE Flag Icon */}
      <div className="w-4.5 h-3 relative overflow-hidden rounded-[2px] shadow-sm flex-shrink-0">
        <div className="absolute left-0 top-0 bottom-0 w-[25%] bg-[#FF0000] z-10" />
        <div className="absolute right-0 top-0 h-[33.33%] w-[75%] bg-[#00732F]" />
        <div className="absolute right-0 top-[33.33%] h-[33.33%] w-[75%] bg-white" />
        <div className="absolute right-0 bottom-0 h-[33.33%] w-[75%] bg-black" />
      </div>

      <Link href="#" className="hover:opacity-80 transition-opacity">
        <Heart className={cn("w-4.5 h-4.5", textColor)} />
      </Link>

      <Link href="#" className="relative hover:opacity-80 transition-opacity inline-block">
        {/* Ensure the Bell icon is white to match the image */}
        <Bell className={cn("w-5 h-5", "text-white")} />
        <span className="absolute -top-1.5 -right-2 z-10 bg-transparent border-[2px] border-white text-white text-[8px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
          3
        </span>
      </Link>
    </div>
  );

  return (
    <nav className={cn(
      "w-full top-0 pr-4 sm:px-6 lg:px-8 border-b-2 z-[500] transition-colors duration-300",
      isHome ? "bg-transparent border-transparent absolute" : "bg-white border-gray-100 sticky"
    )}>
      <div className="flex items-start justify-between gap-5">
        <Logo logo={configData?.site_logo} />

        <div className="my-auto">
          {!isHome && <NavLinks />}
        </div>

        <div className="hidden sm:flex flex-col items-end gap-3 mt-2">
          <div className={cn("flex items-center gap-3 text-xs tracking-wide", textColor)}>
            <span onClick={handleClick} className="hover:opacity-80 transition-opacity cursor-pointer">Place an Ad</span>
            <span className="opacity-40">|</span>
            <Link href="#" className="hover:opacity-80 transition-opacity">Help</Link>
            <span className="opacity-40 text-[10px]">|</span>
            {!isAuth ? (
              <Link href="/auth/login" className="hover:opacity-80 transition-opacity">Sign In</Link>
            ) : (
              <UserMenu />
            )}
            <LoginDialog
              open={showLoginDialog}
              onOpenChange={setShowLoginDialog}
              description="You must be logged in to start a chat."
            />
          </div>

          <div className="flex items-center gap-5 mt-1">
            <Link href="/auth/login" className={cn("text-sm hover:opacity-80", textColor)}>
              Account
            </Link>
            <UtilityIcons />
          </div>
        </div>

        <div className="flex sm:hidden items-center gap-4 my-auto">
          {isAuth && (
            <Link href="#" className="relative hover:opacity-80 transition-opacity inline-block">
              {/* Ensure the Bell icon is white to match the image */}
              <Bell className={cn("w-5 h-5", "text-white")} />
              <span className="absolute -top-1.5 -right-2 z-10 bg-transparent border-[2px] border-white text-white text-[8px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
                3
              </span>
            </Link>
          )}
          <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="cursor-pointer">
            {isMenuOpen ? <X className={cn("w-6 h-6", textColor)} /> : <Menu className={cn("w-6 h-6", textColor)} />}
          </button>
          {isAuth && <UserMenu />}
        </div>
      </div>

      {isMenuOpen && (
        <div className="block sm:hidden bg-white border-t border-gray-100 animate-in slide-in-from-top-2 ml-4 duration-200">
          <div className="flex flex-col gap-4 py-4 px-4">
            <NavLinks isMobile />
            <div className="flex flex-col gap-4">
              {isAuth ? (
                <Link href="/post-ad" onClick={() => setIsMenuOpen(false)}>
                  <Button className="w-full">Post Ad</Button>
                </Link>
              ) : (
                <Link href="/auth/login">
                  <Button variant="outline" className="w-full bg-transparent text-black border-gray-200">Sign In</Button>
                </Link>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;