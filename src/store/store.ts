import { configureStore } from "@reduxjs/toolkit"
import authReducer from "./slices/AuthSlice"
import chatCountReducer from "./slices/ChatSlice"
import cartReducer from "./slices/CartSlice"

export const store = configureStore({
  reducer: {
    auth: authReducer,
    chatCount: chatCountReducer,
    cart: cartReducer,
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch