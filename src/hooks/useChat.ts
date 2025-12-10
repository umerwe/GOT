import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { chatInbox, getMessages, sendMessage } from "@/services/chat"
import { AxiosError } from "axios"
import { toast } from "@/components/ui/toast"

export const useGetChatInbox = () =>
  useQuery({
    queryKey: ["chatInbox"],
    queryFn: chatInbox,
    staleTime: 0,
  });

export const useGetMessages = (receiver_id: string) =>
  useQuery({
    queryKey: ["messages", receiver_id],
    queryFn: () => getMessages(receiver_id),
    enabled: !!receiver_id,
    staleTime: 0,
  })

export const useSendMessage = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: sendMessage,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["messages", "chatInbox"] })
    },
    onError: (err: AxiosError<{ message: string }>) => {
      toast({
        title: "Message not send",
        description: `${err?.response?.data?.message}`,
        variant: "destructive",
      })
    },
  })
}
