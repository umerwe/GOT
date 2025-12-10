"use client";

import Image from "next/image";
import { useState } from "react";
import { Bell, Menu, X, Heart } from "lucide-react";
import { Button } from "./ui/button";
import Link from "next/link";
import { useAppSelector } from "@/store/hooks";
import { usePathname } from "next/navigation";
import { UserMenu } from "./user-menu";
import { cn } from "@/lib/utils";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const isAuth = useAppSelector((state) => state.auth.token);
  const totalCount = useAppSelector((state) => state.chatCount.totalCount);
  const configData = useAppSelector((state) => state.config.data)
  const pathname = usePathname();
  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  const isHome = pathname === "/";
  const textColor = isHome ? "text-white" : "text-black";
  const getLinkColor = (isMobile: boolean) => isMobile ? "text-gray-900" : textColor;

  const linkClasses = (path: string, isMobile: boolean, exact = true) =>
    cn(
      "hover:text-yellow-500 transition-colors relative pb-1",
      getLinkColor(isMobile),
      exact
        ? pathname === path ? "text-yellow-500" : ""
        : pathname.startsWith(path) ? "text-yellow-500" : ""
    );

  const NavLinks = ({ isMobile = false }: { isMobile?: boolean }) => (
    <div className={`${isMobile ? "flex flex-col gap-4" : "hidden sm:flex items-center gap-6 ml-8 text-sm font-medium"}`}>
      <Link href="/" className={linkClasses("/", isMobile)} onClick={() => isMobile && setIsMenuOpen(false)}>
        Home
      </Link>
      <Link href="/ads/all" className={linkClasses("/ads", isMobile, false)} onClick={() => isMobile && setIsMenuOpen(false)}>
        Ads
      </Link>
    </div>
  );

  const MobileIcons = () => (
    <div className="flex gap-4 items-center">
      {/* {isAuth && (
        <Link href="/chat" className="relative cursor-pointer hover:opacity-80 transition-opacity">
          <MessageSquare className={cn("w-5 h-5", textColor)} />
          {totalCount >= 1 && <span className="absolute -top-1 -right-1 bg-blue-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">{totalCount}</span>}
        </Link>
      )} */}
      <Link href="/notifications" className="relative cursor-pointer hover:opacity-80 transition-opacity">
        <Bell className={cn("w-5 h-5", textColor)} />
        <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">3</span>
      </Link>
    </div>
  );

  const MobileButtons = () => (
    <div className="flex flex-col gap-4">
      {isAuth ? (
        <>
          <Link href="/post-ad" className="w-full sm:w-auto" onClick={() => setIsMenuOpen(false)}>
            <Button variant="default" className="w-full">Post Ad</Button>
          </Link>
          <UserMenu />
        </>
      ) : (
        <Link href="/auth/login" className="w-full sm:w-auto">
          <Button variant="outline" className={cn("w-full sm:flex-1 bg-transparent text-black border-gray-200")}>Log In / Sign Up</Button>
        </Link>
      )}
    </div>
  );

  return (
    <nav className={cn("w-full top-0 py-3 px-4 sm:px-6 lg:px-8 border-b-2 z-50 transition-colors duration-300", isHome ? "bg-transparent border-transparent absolute" : "bg-white border-gray-100 sticky")}>
      <div className="flex items-center justify-between gap-5">

        {/* Logo Section */}
        <div className="flex items-center gap-3 text-base sm:text-xl font-semibold flex-shrink-0">
          <div className="relative flex items-center justify-center">
            {configData?.site_logo ? (
              <Image src={configData.site_logo} width={256} height={256} alt="logo-img" className="object-contain -rotate-17 w-[35px] h-[35px] sm:w-[70px] sm:h-[70px]" />
            ) : (
              <div className="flex items-center justify-center bg-solid text-black font-bold rounded-full w-[35px] h-[35px] sm:w-[45px] sm:h-[45px]">G</div>
            )}
          </div>
          {
            !isHome &&
            <NavLinks />
          }
        </div>

        <div className="hidden lg:flex flex-col items-end gap-1">
          <div className={cn("flex items-center gap-3 text-xs tracking-wide", textColor)}>
            {
              isAuth &&
              <>
                <Link href="/post-ad" className="hover:opacity-80 transition-opacity">
                  Place an Ad
                </Link>
                <span className="opacity-40">|</span></>
            }
            <Link href="#" className="hover:opacity-80 transition-opacity">
              Help
            </Link>
            {!isAuth ? (
              <>
                <span className="opacity-40 text-[10px]">|</span>
                <Link href="/auth/login" className="hover:opacity-80 transition-opacity">
                  Sign In
                </Link>
              </>
            )
              :
              <>
                <span className="opacity-40 text-[10px]">|</span>
                <UserMenu />
              </>
            }
          </div>

          <div className="flex items-center gap-5 mt-1">
            <div className="flex items-center gap-2">
              <Link href="/auth/login" className={cn("text-sm text-white hover:opacity-80", textColor)}>
                Account
              </Link>
            </div>

            <div className="flex items-center gap-4">
              <div className="w-4.5 h-3 relative overflow-hidden rounded-[2px] shadow-sm">
                <div className="absolute left-0 top-0 bottom-0 w-[25%] bg-[#FF0000] z-10"></div>
                <div className="absolute right-0 top-0 h-[33.33%] w-[75%] bg-[#00732F]"></div>
                <div className="absolute right-0 top-[33.33%] h-[33.33%] w-[75%] bg-white"></div>
                <div className="absolute right-0 bottom-0 h-[33.33%] w-[75%] bg-black"></div>
              </div>

              <Link href="#" className="hover:opacity-80 transition-opacity">
                <Heart className={cn("w-4.5 h-4.5", textColor)} />
              </Link>

              <Link href="/notifications" className="relative hover:opacity-80 transition-opacity">
                <Bell className={cn("w-4.5 h-4.5", textColor)} />
                <span className="absolute -top-1.5 -right-1 bg-red-500 text-white text-[9px] font-bold rounded-full w-3.5 h-3.5 flex items-center justify-center">
                  3
                </span>
              </Link>

              {/* {isAuth && (
                <Link href="/chat" className="relative hover:opacity-80 transition-opacity">
                  <MessageSquare className={cn("w-5 h-5", textColor)} />
                  {totalCount >= 1 && (
                    <span className="absolute -top-1.5 -right-1 bg-blue-500 text-white text-[9px] font-bold rounded-full w-3.5 h-3.5 flex items-center justify-center">
                      {totalCount}
                    </span>
                  )}
                </Link>
              )} */}
            </div>
          </div>
        </div>

        <div className="flex lg:hidden items-center gap-4">
          {isAuth && <MobileIcons />}
          <button onClick={toggleMenu} className="cursor-pointer">
            {isMenuOpen ? <X className={cn("w-6 h-6", textColor)} /> : <Menu className={cn("w-6 h-6", textColor)} />}
          </button>
          {isAuth && <UserMenu />}
        </div>
      </div>

      {isMenuOpen && (
        <div className="block lg:hidden mt-3 bg-white border-t border-gray-200 animate-in slide-in-from-top-2 duration-200">
          <div className="flex flex-col gap-4 py-4 px-4">
            <NavLinks isMobile={true} />
            <MobileButtons />
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;