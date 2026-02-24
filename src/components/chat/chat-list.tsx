"use client"

import { useState, useMemo } from "react"
import { Input } from "@/components/ui/input"
import { useAppSelector } from "@/store/hooks"
import SkeletonLoader from "@/common/skeleton-loader"
import ChatItem from "./chat-item"
import type { Chat } from "@/types/chat"
import { ArrowLeft } from "lucide-react"
import { useRouter } from "next/navigation"
import { useGetProfile } from "@/hooks/useProfile"

interface ChatListProps {
  onChatSelect?: (receiverId: number, chatId: number) => void
  currentConversationId?: number | null
  activeReceiverId?: number
  className?: string
  chatCount?: Record<number, number>
  type?: string
  inboxData?: Chat[]
  isInboxLoading?: boolean
}


const ChatList = ({
  onChatSelect,
  activeReceiverId,
  currentConversationId,
  className = "",
  chatCount = {},
  type,
  inboxData = [],
  isInboxLoading = false,
}: ChatListProps) => {
  const { data: profileData } = useGetProfile()
  const userId = profileData?.id;
  const [searchQuery, setSearchQuery] = useState("")
  const router = useRouter()

  const filteredInboxData: Chat[] = useMemo(() => {
    if (!searchQuery) return inboxData
    return inboxData.filter((chat: Chat) => chat.receiver_name?.toLowerCase().includes(searchQuery.toLowerCase()))
  }, [inboxData, searchQuery])

  return (
    <div className={`flex flex-col ${className}`}>
      <div className="flex items-center px-4 py-3 border-b border-gray-200">
        <button onClick={() => router.push(type === "chatId" ? "/chat" : "/")} className="flex items-center text-gray-700 hover:text-[#000000]">
          <ArrowLeft className="w-5 h-5 mr-2" />
          <span className="font-medium">{type === "chatId" ? "Chat" : "Home"}</span>
        </button>
      </div>
      {/* Search */}
      <div className="flex items-center rounded-lg px-3 py-2 m-4">
        <Input
          placeholder="Search chat"
          showIcon={true}
          iconPosition={"left"}
          isSearch={true}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="bg-gray-100"
        />
      </div>

      {/* Chats */}
      <div className="flex-1 px-4 pb-4 space-y-4 overflow-y-auto">
        {isInboxLoading ? (
          <SkeletonLoader type="chat" count={5} />
        ) : filteredInboxData.length === 0 ? (
          <p className="text-gray-500 text-center">No chats available</p>
        ) : (
          filteredInboxData.map((chat: Chat, i) => {
            return (
              <ChatItem
                key={i}
                chat={chat}
                isActive={activeReceiverId === chat.receiver_id}
                onClick={() => onChatSelect?.(chat.receiver_id, chat.id)}
                userId={Number(userId)}
                unreadCount={
                  chat.id === currentConversationId ? 0 :
                    chatCount[chat.receiver_id] || Number(chat.unread_message_count) || 0
                }
              />
            )
          })
        )}
      </div>
    </div>
  )
}

export default ChatList
