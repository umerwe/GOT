"use client"

import { useRouter } from "next/navigation"
import { useGetProfile } from "@/hooks/useProfile"
import Image from "@/components/custom/MyImage"

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

export const UserMenu = () => {
  const router = useRouter()
  const { data, isLoading } = useGetProfile();
  const dispatch = useDispatch();
  const queryClient = useQueryClient();

  const handleLogout = async () => {
    console.log("Logout clicked")
    dispatch(logout());
    router.replace('/auth/login');
    await signOut({ redirect: false });
    queryClient.clear();
  }

  if (isLoading) return <div className="w-8 h-8 rounded-full bg-gray-200 animate-pulse" />;

  const isBusiness = data?.user_type === "business";

  const ProfileAvatar = (
    <div className="w-8 h-8 rounded-full overflow-hidden cursor-pointer">
      <Image
        src={isBusiness ? data?.logo : data?.profile_image}
        alt="profile"
        width={32}
        height={32}
        className="rounded-full object-cover w-full h-full"
      />
    </div>
  );

  // If NOT business, just return the clickable avatar
  if (!isBusiness) {
    return (
      <div onClick={() => router.push("/dashboard")}>
        {ProfileAvatar}
      </div>
    );
  }

  // If business, return the Dropdown
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button type="button" className="outline-none ring-0 border-none p-0 bg-transparent">
          {ProfileAvatar}
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuPortal>
        <DropdownMenuContent align="end" className="w-40 z-[999]">
          <DropdownMenuItem onSelect={() => router.push("/business-management/profile")} className="cursor-pointer">
            Profile
          </DropdownMenuItem>
          <DropdownMenuItem onSelect={handleLogout} className="cursor-pointer">
            Logout
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenuPortal>
    </DropdownMenu>
  )
}