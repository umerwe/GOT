"use client"

import Image from "next/image"
import { useRouter } from "next/navigation"
import { capitalizeWords } from "@/utils/capitalizeWords"
import { ChatInfo } from "@/types/chat"

interface ConversationHeaderProps {
  chatInfo: ChatInfo
  isLoading?: boolean
}

const ConversationHeader = ({ chatInfo, isLoading = false }: ConversationHeaderProps) => {
  const router = useRouter()

  return (
    <div className="border-b border-gray-200 p-4 flex items-center space-x-3 flex-shrink-0">
      {/* Back button only on mobile */}
      <button
        onClick={() => router.push("/chat")}
        className="md:hidden mr-2 p-2 rounded-full hover:bg-gray-100"
        aria-label="Back to chats"
      >
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 19l-7-7 7-7"
          />
        </svg>
      </button>

      {isLoading ? (
        <>
          <div className="w-10 h-10 rounded-full bg-gray-200 animate-pulse" />
          <div className="h-4 w-32 bg-gray-200 rounded animate-pulse" />
        </>
      ) : chatInfo.receiver_image ? (
        <Image
          src={chatInfo.receiver_image || "/placeholder.svg"}
          alt={chatInfo.receiver_name || "User"}
          width={40}
          height={40}
          className="w-10 h-10 rounded-full flex-shrink-0 object-cover"
        />
      ) : (
        <div className="w-10 h-10 rounded-full bg-gray-200 animate-pulse" />
      )}

      {isLoading ? null : chatInfo.receiver_name ? (
        <span className="font-semibold text-gray-800 truncate">
          {capitalizeWords(chatInfo.receiver_name as string)}
        </span>
      ) : (
        <div className="h-4 w-32 bg-gray-200 rounded animate-pulse" />
      )}
    </div>
  )
}

export default ConversationHeader
