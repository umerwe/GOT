"use client"

import Image from "@/components/custom/MyImage"
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog"
import { VisuallyHidden } from "@radix-ui/react-visually-hidden"
import { DialogTitle } from "@radix-ui/react-dialog"
import { ChatInfo, Message } from "@/types/chat"
import { capitalizeWords } from "@/utils/capitalizeWords"
import MyImage from "../custom/MyImage"

interface MessageBubbleProps {
  message: Message
  isOwn: boolean
  chatInfo: ChatInfo
}

const MessageBubble = ({ message, isOwn, chatInfo }: MessageBubbleProps) => {
  console.log({ message });
  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };
  return (
    <div className={`flex ${isOwn ? "justify-end" : "justify-start"} w-full`}>
      {!isOwn && (
        <div>
          <MyImage
            src={message.sender_image || chatInfo.receiver_image || "/fallback.png"}
            alt={message.sender_name}
            width={256}
            height={256}
            className="w-8 h-8 rounded-full flex-shrink-0 object-cover mr-2"
          />
        </div>
      )}
      <div className="flex flex-col max-w-[80%] md:max-w-[60%]">
        <p
          className={`text-xs mb-1 ${isOwn ? "text-right text-gray-500" : "text-left text-gray-500"
            }`}
        >
          {capitalizeWords(message.sender_name)}
        </p>
        <div
          className={`px-4 py-2 rounded-lg break-words ${isOwn
            ? "bg-[#FFC107] text-gray-800"
            : "bg-[#FFEFBA] text-gray-800"
            }`}
        >
          {message.message ? (
            <>
              <p>{message.message}</p>
              <p
                className={`text-[10px] mt-1 ${isOwn ? "text-right text-gray-600" : "text-left text-gray-600"
                  }`}
              >
                {formatTime(message.created_at)}
              </p>
            </>
          ) : message.file?.length ? (
            <div className="space-y-2">
              {message.file.map((file: string, index: number) => (
                <Dialog key={index}>
                  <DialogTrigger asChild>
                    <Image
                      src={file || "/fallback.png"}
                      alt={`Attachment ${index + 1}`}
                      width={200}
                      height={200}
                      className="rounded-lg max-w-full h-auto cursor-pointer hover:opacity-80"
                    />
                  </DialogTrigger>
                  <DialogContent className="max-w-3xl">
                    <VisuallyHidden>
                      <DialogTitle>Image Preview</DialogTitle>
                    </VisuallyHidden>
                    <Image
                      src={file || "/fallback.png"}
                      alt={`Full-size attachment ${index + 1}`}
                      width={800}
                      height={800}
                      className="w-full h-auto rounded-lg"
                    />
                  </DialogContent>
                </Dialog>
              ))}
            </div>
          ) : (
            "No message"
          )}
        </div>
      </div>
      {isOwn && (
        <div>
          <MyImage
            src={message.sender_image || chatInfo.receiver_image || "/fallback.png"}
            alt={message.sender_name}
            width={256}
            height={256}
            className="w-8 h-8 rounded-full ml-2 flex-shrink-0 object-cover"
          />
        </div>
      )}
    </div>
  )
}

export default MessageBubble
