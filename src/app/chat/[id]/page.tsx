"use client"

import { useParams, usePathname, useRouter, useSearchParams } from "next/navigation"
import { useEffect, useMemo, useState } from "react"
import { useGetChatInbox, useGetMessages } from "@/hooks/useChat"
import { useAppDispatch, useAppSelector } from "@/store/hooks"
import ChatList from "@/components/chat/chat-list"
import ConversationHeader from "@/components/chat/conversation-header"
import MessageForm from "@/components/chat/message-form"
import type { Chat, ChatInfo, ChatUser, Message } from "@/types/chat"
import MessagesList from "@/components/chat/message-list"
import AuthGuard from "@/common/auth-guard"
import api from "@/lib/axios"
import { resetChatCount } from "@/store/slices/ChatSlice"
import { useGetProfile } from "@/hooks/useProfile"

const ConversationPage = () => {
  const { data: profileData } = useGetProfile()

  const { id } = useParams();
  const searchParams = useSearchParams()
  const pathname = usePathname()
  const router = useRouter()
  const conversationId = searchParams.get("conversation_id")
  const userId = profileData?.id;
  const dispatch = useAppDispatch()
  const { data: inboxDataRaw = [], isLoading: isInboxLoading } = useGetChatInbox()
  const { data: messagesDataRaw = [], isLoading: isMessagesLoading } = useGetMessages(id as string)

  const chatCount = useAppSelector((state) => state.chatCount.counts)
  const reduxMessages = useAppSelector((state) => state.chatCount.messages)
  const [messages, setMessages] = useState<Message[]>([])

  useEffect(() => {
    if (!messagesDataRaw || messagesDataRaw.length === 0) return
    setMessages((prev) => {
      const newSorted = [...messagesDataRaw].sort((a, b) => a.id - b.id)
      if (prev.length && prev[prev.length - 1].id === newSorted[newSorted.length - 1].id) {
        return prev
      }
      return newSorted
    })
  }, [messagesDataRaw])

  const mergedMessages = useMemo(() => {
    const isChatRoute = pathname.startsWith("/chat")

    if (isChatRoute) {
      const reduxForThisChat = reduxMessages.filter(
        (msg) => String(msg.conversation_id) === String(conversationId)
      )

      const newReduxOnly = reduxForThisChat.filter(
        (reduxMsg) => !messages.some((apiMsg) => apiMsg.id === reduxMsg.id)
      )

      return [...messages, ...newReduxOnly].sort(
        (a, b) =>
          new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
      )
    }

    return messages
  }, [messages, reduxMessages, conversationId, pathname])

  const inboxData = inboxDataRaw.filter((x: Chat) => x.receiver_id !== Number(userId))

  const activeChat = useMemo(() => {
    return inboxData.find((chat: Chat) => chat.receiver_id === Number(id))
  }, [inboxData, id])

  const chatInfo = useMemo<ChatInfo>(() => {
    if (isInboxLoading) {
      return { receiver_id: Number(id), receiver_name: null, receiver_image: null }
    }
    if (activeChat) {
      return {
        receiver_id: activeChat.receiver_id,
        receiver_name: activeChat.receiver_name,
        receiver_image: activeChat.receiver_image || "/diverse-user-avatars.png",
      }
    }
    let parsedChatUser: ChatUser | null = null
    if (typeof window !== "undefined") {
      const chatUser = localStorage.getItem("chatUser")
      if (chatUser) {
        try {
          parsedChatUser = JSON.parse(chatUser);
        } catch {
          console.error("Failed to parse User");
        }
      }
    }
    return {
      receiver_id: Number(id),
      receiver_name: parsedChatUser?.name || "New Chat",
      receiver_image: parsedChatUser?.profile_image || "/diverse-user-avatars.png",
    }
  }, [activeChat, id, isInboxLoading])

  useEffect(() => {
    const fetchMessagesForActiveChat = async () => {
      if (!id) return;

      const activeReceiverId = Number(id);
      const chat = inboxData.find((c: Chat) => c.receiver_id === activeReceiverId);
      if (chat) {
        try {
          await api.get(`/message/get?receiver_id=${activeReceiverId}`);
          // reset only if there are unread messages
          if (chatCount[activeReceiverId]) {
            dispatch(resetChatCount(activeReceiverId));
          }
        } catch (error) {
          console.error("Error fetching messages for active chat", error);
        }
      }
    };

    fetchMessagesForActiveChat();
  }, [inboxData, id, dispatch, chatCount]);


  const handleChatSelect = async (receiverId: number, chatId?: number) => {
    if (chatId) {
      try {
        await api.get(`/message/get?receiver_id=${receiverId}`)
        dispatch(resetChatCount(receiverId))

      } catch {
        console.error("Error fetching messages on chat select")
      }
    }
    // Router push
    router.push(`/chat/${receiverId}?conversation_id=${chatId}`)
  }


  const handleMessageSent = (newMessage: Message) => {
    setMessages((prev) => [...prev, newMessage])
  }

  return (
    <AuthGuard>
      <div className="flex w-full h-screen md:h-screen overflow-hidden flex-col md:flex-row">
        {/* Chat list */}
        <ChatList
          onChatSelect={handleChatSelect}
          activeReceiverId={Number(id)}
          currentConversationId={conversationId ? Number(conversationId) : null} // pass conversationId
          className={`w-full md:w-1/3 border-r border-gray-200 overflow-y-auto ${id ? "hidden md:flex" : "flex"}`}
          chatCount={chatCount}
          type="chatId"
          inboxData={inboxDataRaw}
          isInboxLoading={isInboxLoading}
        />



        {/* Conversation area */}
        <div className={`flex-1 flex flex-col w-full h-full ${id ? "flex" : "hidden md:flex"}`}>
          <ConversationHeader chatInfo={chatInfo} isLoading={isInboxLoading} />

          {/* Messages */}
          <div className="flex-1 overflow-y-auto">
            <MessagesList
              messages={mergedMessages}
              isLoading={isMessagesLoading}
              userId={Number(userId)}
              chatInfo={chatInfo}
            />
          </div>

          {/* Form */}
          <div className="border-t border-gray-200 flex-shrink-0">
            <MessageForm
              receiverId={id as string}
              onMessageSent={handleMessageSent}
            />
          </div>
        </div>
      </div>
    </AuthGuard>
  )
}

export default ConversationPage
