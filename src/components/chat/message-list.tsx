"use client"

import { useRef, useEffect } from "react"
import SkeletonLoader from "@/common/skeleton-loader"
import MessageBubble from "./message-bubble"
import { ChatInfo, Message } from "@/types/chat"

interface MessagesListProps {
  messages: Message[]
  isLoading: boolean
  userId: number
  chatInfo: ChatInfo
}

const MessagesList = ({ messages, isLoading, userId, chatInfo }: MessagesListProps) => {
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (messagesEndRef.current && !isLoading) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" })
    }
  }, [messages, isLoading])

  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-6 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
      {isLoading ? (
        <SkeletonLoader type="chat" count={5} />
      ) : messages.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-500 text-lg mb-2">Start your conversation</p>
          <p className="text-gray-400 text-sm">Send a message to begin chatting</p>
        </div>
      ) : (
        messages.map((msg: Message, i) => (
          <MessageBubble
            key={i}
            message={msg}
            isOwn={msg.sender_id === userId}
            chatInfo={chatInfo}
          />
        ))
      )}
      <div ref={messagesEndRef} />
    </div>
  )
}

export default MessagesList
