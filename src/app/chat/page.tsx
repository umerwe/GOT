"use client"

import AuthGuard from "@/common/auth-guard"
import ChatList from "@/components/chat/chat-list"
import EmptyChatState from "@/components/chat/empty-chat-state"
import { useRouter } from "next/navigation"
import { useAppSelector } from "@/store/hooks"
import { useGetChatInbox } from "@/hooks/useChat"

const ChatPage = () => {
  const router = useRouter()
  const chatCount = useAppSelector((state) => state.chatCount.counts)

  const { data: inboxData = [], isLoading: isInboxLoading } = useGetChatInbox()

  const handleChatSelect = (receiverId: number, chatId?: number) => {
    router.push(`/chat/${receiverId}?conversation_id=${chatId}`)
  }

  return (
    <AuthGuard>
      <div className="flex h-screen flex-row">
        <ChatList
          onChatSelect={handleChatSelect}
          className="w-full md:w-1/3 border-r border-gray-200"
          chatCount={chatCount}
          inboxData={inboxData}
          isInboxLoading={isInboxLoading}
        />

        {/* Empty Chat placeholder only visible on md+ screens */}
        <div className="hidden md:flex w-2/3 items-center justify-center">
          <EmptyChatState />
        </div>
      </div>
    </AuthGuard>
  )
}

export default ChatPage
