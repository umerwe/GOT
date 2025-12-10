"use client"

import type React from "react"
import { useRef } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Paperclip, X } from "lucide-react"
import { useSendMessage } from "@/hooks/useChat"
import { messageSchema, type MessageFormData } from "@/validations/message"
import Image from "next/image"
import { Message } from "@/types/chat"
import { useGetProfile } from "@/hooks/useProfile"

interface MessageFormProps {
  receiverId: string
  onMessageSent?: (newMessage: Message) => void
}

const MessageForm = ({ receiverId, onMessageSent }: MessageFormProps) => {
  const { data: profileData = [] } = useGetProfile();

  const fileInputRef = useRef<HTMLInputElement>(null)
  const sendMessageMutation = useSendMessage()

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<MessageFormData>({
    resolver: zodResolver(messageSchema),
    defaultValues: { message: "", images: undefined },
  })

  const watchedImages = watch("images") as FileList | null | undefined
  const watchedMessage = watch("message")

  const fileListToArray = (files: FileList | null | undefined) =>
    files ? Array.from(files) : []

  const selectedFiles = fileListToArray(watchedImages)

  const removeFile = (index: number) => {
    if (!watchedImages) return
    const newFiles = selectedFiles.filter((_, i) => i !== index)
    const dt = new DataTransfer()
    newFiles.forEach((f) => dt.items.add(f))
    setValue("images", dt.files, { shouldValidate: true })
    if (fileInputRef.current) fileInputRef.current.files = dt.files
  }

  const onSubmit = async (data: MessageFormData) => {
    const formData = new FormData()
    formData.append("receiver_id", receiverId)

    if (data.message?.trim()) {
      formData.append("message", data.message.trim())
    }

    if (data.images) {
      Array.from(data.images)
        .slice(0, 6)
        .forEach((img, i) => formData.append(`images[${i}]`, img))
    }

    // Create optimistic message
    const optimisticMessage: Message = {
      id: Date.now(),
      sender_id: profileData?.id,
      sender_name: profileData?.name,
      sender_image: profileData?.profile_image,
      message: data.message?.trim() || "",
      file: data.images
        ? Array.from(data.images).map((f) => URL.createObjectURL(f))
        : [],
      created_at: new Date().toISOString(),
    }

    onMessageSent?.(optimisticMessage)

    // Send to API
    await sendMessageMutation.mutateAsync(formData)

    reset()
    if (fileInputRef.current) fileInputRef.current.value = ""
  }

  const isSendDisabled =
    isSubmitting ||
    sendMessageMutation.isPending ||
    (!watchedMessage?.trim() && selectedFiles.length === 0)

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="border-t border-gray-200 p-4 bg-white flex-shrink-0 w-full"
    >
      <div className="flex items-center gap-2">
        {/* Attach button */}
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="p-2 text-gray-500 hover:text-gray-700 transition-colors"
        >
          <Paperclip size={20} />
        </button>

        <input
          type="file"
          ref={fileInputRef}
          onChange={(e) =>
            e.target.files &&
            setValue("images", e.target.files, { shouldValidate: true })
          }
          multiple
          accept="image/png,image/jpeg"
          className="hidden"
        />

        {/* Input area */}
        <div className="flex-1 flex flex-col border border-gray-300 rounded-lg px-2 py-1 focus-within:border-[#FFC107] focus-within:ring-1 focus-within:ring-[#FFC107]">
          {selectedFiles.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {selectedFiles.map((file, i) => (
                <div
                  key={i}
                  className="relative w-16 h-16 rounded-md overflow-hidden border"
                >
                  <Image
                    src={URL.createObjectURL(file)}
                    alt={file.name}
                    width={200}
                    height={200}
                    unoptimized
                    className="w-full h-full object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => removeFile(i)}
                    className="absolute top-0 right-0 bg-black bg-opacity-50 text-white rounded-full p-0.5 hover:bg-red-600"
                  >
                    <X size={12} />
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <input
              {...register("message")}
              type="text"
              placeholder="Write a message..."
              className="w-full outline-none text-sm px-1 py-1"
            />
          )}
        </div>

        {/* Send button */}
        <button
          type="submit"
          disabled={isSendDisabled}
          className="bg-[#FFC107] px-4 py-2 rounded-lg text-gray-800 text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#FFB300] transition-colors"
        >
          Send
        </button>
      </div>

      {errors.images && (
        <p className="text-red-500 text-xs mt-2 px-2">
          {errors.images.message as string}
        </p>
      )}
    </form>
  )
}

export default MessageForm
