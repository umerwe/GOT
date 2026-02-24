"use client"

import { useEffect } from "react"
import { getPusherClient } from "@/lib/pusher-client"
import { useAppSelector, useAppDispatch } from "@/store/hooks"
import { addMessage, setChatCount } from "@/store/slices/ChatSlice"
import { Message } from "@/types/chat"
import { useGetProfile } from "@/hooks/useProfile"

const ChatListener = () => {
    const { data: profileData } = useGetProfile();
    
    const userId = profileData?.id;
    const dispatch = useAppDispatch();
    const chatCount = useAppSelector((state) => state.chatCount.counts)

    useEffect(() => {
        if (!userId) return
        const pusher = getPusherClient()
        const channel = pusher.subscribe("GetOutThere")
        const eventName = `new_message_${userId}`

        const handleNewMessage = (data: Message) => {
            try {
                const parsedMessage =
                    typeof data.message === "string" ? JSON.parse(data.message) : data.message
                    dispatch(
                    setChatCount({
                        receiverId: parsedMessage.result.sender_id,
                        count: (chatCount[parsedMessage.result.sender_id] || 0) + 1,
                    })
                )

                dispatch(addMessage(parsedMessage.result))
            } catch {
                console.error("Failed to parse Pusher message")
            }
        }

        channel.bind(eventName, handleNewMessage)

        return () => {
            channel.unbind(eventName, handleNewMessage)
            channel.unsubscribe()
        }
    }, [dispatch, chatCount, userId])

    return null
}

export default ChatListener
