"use client"

import { useParams, usePathname, useRouter, useSearchParams } from "next/navigation"
import { useEffect, useMemo, useState, useRef } from "react"
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
  const searchParams = useSearchParams();

  const productId = searchParams.get("product_id")

  const pathname = usePathname()
  const router = useRouter()
  const conversationId = searchParams.get("conversation_id")
  const userId = profileData?.id;
  const dispatch = useAppDispatch()
  const { data: inboxDataRaw = [], isLoading: isInboxLoading } = useGetChatInbox();

  const { data: messagesDataRaw = [], isLoading: isMessagesLoading } = useGetMessages(conversationId as string)

  const chatCount = useAppSelector((state) => state.chatCount.counts)
  const reduxMessages = useAppSelector((state) => state.chatCount.messages)
  const [messages, setMessages] = useState<Message[]>([])

  const prevConversationIdRef = useRef<string | null>(null)

  useEffect(() => {
    const isNewConversation = prevConversationIdRef.current !== conversationId
    prevConversationIdRef.current = conversationId

    if (isNewConversation) {
      setMessages([])
    }

    if (!messagesDataRaw || messagesDataRaw.length === 0) return

    const newSorted = [...messagesDataRaw].sort((a, b) => a.id - b.id)

    setMessages((prev) => {
      // Only update if last message id differs — avoids infinite loop
      if (
        prev.length === newSorted.length &&
        prev[prev.length - 1]?.id === newSorted[newSorted.length - 1]?.id
      ) {
        return prev
      }
      return newSorted
    })
  }, [conversationId, messagesDataRaw])

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

  // Match activeChat by conversation_id from the inbox
  const activeChat = useMemo(() => {
    if (!conversationId) return null
    return inboxDataRaw.find((chat: Chat) =>
      String(chat.id) === String(conversationId)
    )
  }, [inboxDataRaw, conversationId])

  const chatInfo = useMemo<ChatInfo>(() => {
    if (isInboxLoading) {
      return { receiver_id: Number(id), receiver_name: null, receiver_image: null }
    }
    if (activeChat) {
      return {
        receiver_id: activeChat.receiver_id,
        receiver_name: activeChat.product?.title,
        receiver_image: activeChat.product?.product_images?.[0],
      }
    }
    // Fallback to localStorage for new chats not yet in inbox
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
      if (!conversationId) return;

      const chat = inboxDataRaw.find((c: Chat) =>
        String(c.id) === String(conversationId)
      );
      if (chat) {
        try {
          await api.get(`/message/get?conversation_id=${conversationId}`);
          const activeReceiverId = Number(id);
          if (chatCount[activeReceiverId]) {
            dispatch(resetChatCount(activeReceiverId));
          }
        } catch (error) {
          console.error("Error fetching messages for active chat", error);
        }
      }
    };

    fetchMessagesForActiveChat();
  }, [inboxDataRaw, conversationId, dispatch, chatCount]);

  const handleChatSelect = async (receiverId: number, chatId?: number, productId?: number) => {
    if (chatId) {
      try {
        await api.get(`/message/get?conversation_id=${chatId}`)
        dispatch(resetChatCount(receiverId))
      } catch {
        console.error("Error fetching messages on chat select")
      }
    }
    router.push(`/chat/${receiverId}?conversation_id=${chatId}&product_id=${productId}`)
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
          currentConversationId={conversationId ? Number(conversationId) : null}
          className={`w-full md:w-1/3 border-r border-gray-200 overflow-y-auto ${id ? "hidden md:flex" : "flex"}`}
          chatCount={chatCount}
          type="chatId"
          inboxData={inboxDataRaw}
          isInboxLoading={isInboxLoading}
        />

        {/* Conversation area */}
        <div className={`flex-1 flex flex-col w-full h-full ${id ? "flex" : "hidden md:flex"}`}>
          {!productId && !conversationId ? (
            <div className="flex-1 flex items-center justify-center">
              <p className="text-gray-500 text-center">
                Product ID and Conversation ID are required
              </p>
            </div>
          ) : (
            <>
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
                  productId={productId ? Number(productId) : undefined}
                  onMessageSent={handleMessageSent}
                />
              </div>
            </>
          )}
        </div>
      </div>
    </AuthGuard>
  )
}

export default ConversationPage