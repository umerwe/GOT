"use client"

import { useRouter } from "next/navigation"
import { useGetProfile } from "@/hooks/useProfile"
import Image from "@/components/custom/MyImage"
import { useState } from "react"

import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuPortal,
} from "@/components/ui/dropdown-menu"
import { useDispatch } from "react-redux"
import { useQueryClient } from "@tanstack/react-query"
import { logout } from "@/store/slices/AuthSlice"
import { signOut } from "next-auth/react"
import ConfirmDialog from "@/components/dialogs/loginDialog"

export const UserMenu = () => {
  const router = useRouter()
  const { data, isLoading } = useGetProfile();
  const dispatch = useDispatch();
  const queryClient = useQueryClient();
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);

  const handleLogout = async () => {
    dispatch(logout());
    router.replace('/auth/login');
    await signOut({ redirect: false });
    queryClient.clear();
  }

  const handleLogoutClick = () => {
    setShowConfirmDialog(true);
  }

  if (isLoading) return <div className="w-7 h-7 rounded-full bg-gray-200 animate-pulse" />;

  const isBusiness = data?.user_type === "business";

  const ProfileAvatar = (
    <div className="w-7 h-7 rounded-full overflow-hidden cursor-pointer">
      <Image
        src={isBusiness ? data?.logo : data?.profile_image}
        alt="profile"
        width={256}
        height={256}
        className="rounded-full object-center w-full h-full"
      />
    </div>
  );

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button type="button" className="outline-none ring-0 border-none p-0 bg-transparent">
            {ProfileAvatar}
          </button>
        </DropdownMenuTrigger>

        <DropdownMenuPortal>
          <DropdownMenuContent align="end" className="w-40 z-[999]">
            {/* First option: Dashboard */}
           {
            !isBusiness && (
              <DropdownMenuItem 
                onSelect={() => router.push("/dashboard")} 
                className="cursor-pointer"
              >
                Dashboard
              </DropdownMenuItem>
            )
           }
            
            {/* Second option: Logout */}
            <DropdownMenuItem 
              onSelect={handleLogoutClick} 
              className="cursor-pointer text-red-600"
            >
              Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenuPortal>
      </DropdownMenu>
      
      <ConfirmDialog
        open={showConfirmDialog}
        onOpenChange={setShowConfirmDialog}
        title="Logout Confirmation"
        description="Are you sure you want to logout?"
        confirmText="Logout"
        cancelText="Cancel"
        onConfirm={handleLogout}
        variant="confirm"
      />
    </>
  )
}