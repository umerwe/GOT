export interface Chat {
  id: number
  receiver_id: number
  receiver_name: string | null
  receiver_image: string | null
  unread_message_count: number
  last_message?: {
    id: number
    sender_id: number
    created_at: string
  }
}

export interface Message {
  id: number 
  sender_id: number
  sender_name: string
  sender_image: string | null
  message: string | null
  file?: string[]
  created_at: string
}

export interface ChatInfo {
  receiver_id: number
  receiver_name: string | null
  receiver_image: string | null
}

export interface ChatUser {
  name: string
  profile_image: string
}

export interface SendMessageFormData {
  receiver_id?: string
  message: string
  images: File[] | null
}
