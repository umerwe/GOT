"use client"

import Image from "next/image"
import { capitalizeWords } from "@/utils/capitalizeWords"
import { formatRelativeTime } from "@/utils/formatTime"
import { Chat } from "@/types/chat"
import { useAppDispatch } from "@/store/hooks"
import { resetChatCount } from "@/store/slices/ChatSlice"

interface ChatItemProps {
  chat: Chat
  isActive?: boolean
  onClick: () => void
  userId: number
  unreadCount: number
}

const ChatItem = ({ chat, isActive = false, onClick, userId, unreadCount }: ChatItemProps) => {
  const dispatch = useAppDispatch()
  const handleClick = () => {
    onClick()
    dispatch(resetChatCount(chat.receiver_id))
  }

  return (
    <div
      onClick={handleClick}
      className={`flex items-center justify-between cursor-pointer hover:bg-gray-50 p-2 rounded-lg ${isActive ? "bg-gray-100 border-l-4 border-[#FFC107]" : ""
        }`}
    >
      <div className="flex items-center space-x-3 min-w-0">
        <Image
          src={chat.receiver_image || "/placeholder.svg"}
          alt={chat.receiver_name || "User"}
          width={40}
          height={40}
          className="w-10 h-10 rounded-full flex-shrink-0 object-cover"
        />

        <span className="flex flex-col">
          <span className="font-medium text-gray-800 text-sm sm:text-base truncate max-w-[120px] sm:max-w-[160px]">
            {capitalizeWords(chat.receiver_name as string) || "Unknown User"}
          </span>
          {chat.last_message?.created_at && (
            <span className="text-xs text-gray-500">
              {formatRelativeTime(chat.last_message.created_at)}
            </span>
          )}
        </span>
      </div>

      {unreadCount > 0 && chat?.last_message?.sender_id !== userId && (
        <span className="bg-red-500 text-white text-xs font-semibold px-2 py-1 rounded-full">
          {unreadCount}
        </span>
      )}
    </div>
  )
}


export default ChatItem
