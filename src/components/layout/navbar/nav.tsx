"use client";

import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAppSelector } from "@/store/hooks";
import { cn } from "@/lib/utils";
import { UserMenu } from "../../user-menu";
import LoginDialog from "@/utils/loginDialog";
import NavIcons from "./nav-icons";
import NavLinks from "./nav-links";
import NavActions from "./nav-actions";
import Logo from "@/components/logo";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [showLoginDialog, setShowLoginDialog] = useState(false);

  const pathname = usePathname();
  const isAuth = useAppSelector((state) => state.auth?.token);
  const configData = useAppSelector((state) => state.config.data);
  const cartCount = useAppSelector((state) => state.cart.totalItems);

  useEffect(() => setMounted(true), []);
  
  const isHome = pathname === "/";
  const textColor = isHome ? "text-black sm:text-white" : "text-black";
  const showNavLinks = pathname.startsWith("/ads") || pathname.startsWith("/listing") || pathname.startsWith("/privacy") || pathname.startsWith("/terms");

  const handleProtectedAction = (path: string) => {
    if (!isAuth) return setShowLoginDialog(true);
  };

  const commonProps = { isAuth: !!isAuth, mounted, textColor, handleProtectedAction };

  return (
    <nav className={cn(
      "w-full top-0 md:px-[31px] md:pr-[50px] z-[500] transition-all",
      isHome ? "bg-transparent absolute" : "bg-white sticky"
    )}>
      <div className="flex items-start justify-between pr-4 md:pr-0">
        <Logo
          logo={configData?.site_logo || ""}
        />

        <div className="mt-[45px]">
          {showNavLinks && <NavLinks textColor={textColor} />}
        </div>

        {/* Desktop Actions */}
        <div className="hidden sm:flex flex-col items-end gap-6 mt-1 min-w-[210px]">
          <NavActions {...commonProps} />

          <div className="flex items-center gap-5">
            <Link href={isAuth ? "/dashboard" : "/auth/login"} className={cn("text-base font-medium", textColor)}>
              Account
            </Link>
            <NavIcons {...commonProps} cartCount={cartCount} isHome={isHome} />
          </div>
        </div>

        {/* Mobile Toggle */}
        <div className="flex sm:hidden items-center gap-4 my-auto">
          {mounted && isAuth && <UserMenu />}
          <button onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ?
              <X className={isHome ? "text-white" : "text-black"} />
              : <Menu className={isHome ? "text-white" : "text-black"}
              />
            }
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {isMenuOpen && (
        <div className="sm:hidden bg-white p-4 flex flex-col gap-4 animate-in slide-in-from-top-2">
          <NavLinks
            isMobile
            textColor="text-black"
            onClose={() => setIsMenuOpen(false)}
          />

          <div className="border-t pt-4">
            <NavActions
              {...commonProps}
              isMobile
              onClose={() => setIsMenuOpen(false)}
            />
            <div className="mt-4">
              <NavIcons
                {...commonProps}
                cartCount={cartCount}
                isHome={false}
                textColor="text-black"
              />
            </div>
          </div>
        </div>
      )}

      <LoginDialog
        open={showLoginDialog}
        onOpenChange={setShowLoginDialog}
        description="Please login to continue."
      />
    </nav>
  );
};

export default Navbar;