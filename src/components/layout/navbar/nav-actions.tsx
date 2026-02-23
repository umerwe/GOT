"use client";

import Link from "next/link";
import { UserMenu } from "../../user-menu";
import { cn } from "@/lib/utils";
import { NavActionsProps } from "@/types/navbar";

const NavActions = ({
  isMobile,
  isAuth,
  mounted,
  textColor,
  handleProtectedAction,
  onClose,
}: NavActionsProps) => {
  const wrapperClass = isMobile 
    ? "flex flex-col gap-4 text-black font-medium" 
    : cn("flex items-center gap-3 text-xs tracking-wide h-8", textColor);

  const itemClass = "cursor-pointer hover:opacity-70 transition-opacity";

  return (
    <div className={wrapperClass}>
      <span
        onClick={() => {
          handleProtectedAction("/post-ad");
          onClose?.();
        }}
        className={itemClass}
      >
        Place an Ad
      </span>

      {!isMobile && <span className="opacity-40">|</span>}

      <Link href="/help" onClick={onClose} className={itemClass}>
        Help
      </Link>

      {!isMobile && <span className="opacity-40">|</span>}

      <div className={!isMobile ? "flex justify-end" : ""}>
        {mounted && (
          !isAuth ? (
            <Link href="/auth/login" onClick={onClose} className={itemClass}>
              Sign In
            </Link>
          ) : (
            isMobile ? (
               <Link href="/dashboard" onClick={onClose} className={itemClass}>Account</Link>
            ) : <UserMenu />
          )
        )}
      </div>
    </div>
  );
};

export default NavActions;