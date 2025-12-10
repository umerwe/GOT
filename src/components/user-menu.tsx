"use client"

import Image from "next/image"
import { useState, useEffect, useRef } from "react"
import { LogOut, User } from "lucide-react"
import { useAppDispatch } from "@/store/hooks"
import { useRouter } from "next/navigation"
import { logout } from "@/store/slices/AuthSlice"
import { useGetProfile } from "@/hooks/useProfile"
import { capitalizeWords } from "@/utils/capitalizeWords"
import { useQueryClient } from "@tanstack/react-query"
import { signOut } from "next-auth/react"

export const UserMenu = () => {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const dispatch = useAppDispatch()
  const router = useRouter()
  const queryClient = useQueryClient()
  const { data, isLoading } = useGetProfile()

  const firstLetter = data?.name?.charAt(0)?.toUpperCase() || "U"

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const handleLogout = async () => {
    dispatch(logout())
    router.replace('/auth/login')
    await signOut({ redirect: false });
    queryClient.clear()
    setIsOpen(false)
  }

  return (
    <div className="relative" ref={dropdownRef}>
      <div
        onClick={() => router.push('/dashboard')}
        className="cursor-pointer flex items-center"
      >
        {isLoading || !data?.profile_image ? (
          <div className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-400 text-white font-semibold border">
            {firstLetter}
          </div>
        ) : (
          <Image
            src={data.profile_image}
            alt="profile"
            width={256}
            height={256}
            className="rounded-full object-cover w-7 h-7"
          />
        )}
      </div>

      {/* {isOpen && (
        <div className="absolute right-0 mt-2 w-64 bg-white shadow-lg rounded-xl p z-50 border animate-in fade-in-50 slide-in-from-top-2 duration-200">
          <div className="flex items-center gap-3 px-4 py-3 border-b">
            {isLoading || !data?.profile_image ? (
              <div className="w-12 h-12 flex items-center justify-center rounded-full bg-gray-400 text-white font-bold text-lg border">
                {firstLetter}
              </div>
            ) : (
              <Image
                src={data.profile_image}
                alt="profile"
                width={48}
                height={48}
                className="rounded-full object-cover w-12 h-12 border"
              />
            )}
            <div>
              <p className="text-sm font-semibold text-gray-900">
                {capitalizeWords(data?.name) || "User"}
              </p>
              <p className="text-xs text-gray-500 truncate">
                {data?.email || ""}
              </p>
            </div>
          </div>
          <div className="py-2">
            <button
              onClick={() => {
                router.push("/dashboard")
                setIsOpen(false)
              }}
              className="w-full flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
            >
              <User size={16} /> Dashboard
            </button>
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-500 hover:bg-gray-100"
            >
              <LogOut size={16} /> Logout
            </button>
          </div>
        </div>
      )} */}
    </div>
  )
}
