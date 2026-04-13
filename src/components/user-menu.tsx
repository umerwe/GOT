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
    queryClient.removeQueries({ queryKey: ["profile"] });
    queryClient.clear();
    dispatch(logout());
    await signOut({ 
        callbackUrl: '/auth/login', 
        redirect: true 
    });
    router.push('/auth/login');
  }

  if (isLoading) return <div className="w-7 h-7 rounded-full bg-gray-200 animate-pulse" />;

  const isBusiness = data?.user_type === "business";

  const ProfileAvatar = (
    <div className="w-7 h-7 rounded-full overflow-hidden cursor-pointer">
      <Image
        src={isBusiness ? data?.logo : data?.profile_image}
        alt="profile"
        width={24}
        height={24}
        className="rounded-full object-center w-full h-full"
      />
    </div>
  );

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button type="button" className="outline-none ring-0 border-none p-0 bg-transparent">
          {ProfileAvatar}
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuPortal>
        <DropdownMenuContent align="end" className="w-40 z-[999]">
          {/* First option: Dashboard */}
          <DropdownMenuItem 
            onSelect={() => router.push("/dashboard")} 
            className="cursor-pointer"
          >
            Dashboard
          </DropdownMenuItem>
          
          {/* Second option: Logout */}
          <DropdownMenuItem 
            onSelect={handleLogout} 
            className="cursor-pointer text-red-600"
          >
            Logout
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenuPortal>
    </DropdownMenu>
  )
}