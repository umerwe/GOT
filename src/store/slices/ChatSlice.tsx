import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface Message {
  id: number;
  conversation_id: number;
  sender_id: number;
  sender_name: string;
  sender_image: string;
  sender_type: string | null;
  message: string;
  file?: string[]
  is_seen: boolean;
  created_at: string;
}

interface ChatCountState {
  counts: Record<number, number>;
  totalCount: number;
  messages: Message[];
}

const initialState: ChatCountState = {
  counts: {},
  totalCount: 0,
  messages: [],
};

const chatCountSlice = createSlice({
  name: "chatCount",
  initialState,
  reducers: {
    setChatCount: (
      state,
      action: PayloadAction<{ receiverId: number; count: number }>
    ) => {
      state.counts[action.payload.receiverId] = action.payload.count;

      state.totalCount = Object.values(state.counts).reduce(
        (sum, c) => sum + c,
        0
      );
    },
    resetChatCount: (state, action: PayloadAction<number>) => {
      state.counts[action.payload] = 0;

      // ✅ recalc total count
      state.totalCount = Object.values(state.counts).reduce(
        (sum, c) => sum + c,
        0
      );
    },
    addMessage: (state, action: PayloadAction<Message>) => {
      state.messages.push(action.payload);
    },
  },
});

export const { setChatCount, resetChatCount, addMessage } =
  chatCountSlice.actions;
export default chatCountSlice.reducer;
