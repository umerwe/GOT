"use client"

import { useRouter } from "next/navigation"
import { useGetProfile } from "@/hooks/useProfile"
import Image from "@/components/custom/MyImage"

export const UserMenu = () => {
  const router = useRouter()
  const { data, isLoading } = useGetProfile()

  return (
    <div
      onClick={() => router.push("/dashboard")}
      className="cursor-pointer flex items-center"
    >
      {!isLoading && (
        <Image
          src={data?.profile_image}
          alt="profile"
          width={32}
          height={32}
          wrapperClassName="w-8 h-8 rounded-full"
          className="rounded-full object-cover"
        />
      )}
    </div>
  )
}