import { configureStore } from "@reduxjs/toolkit"
import authReducer from "./slices/AuthSlice"
import chatCountReducer from "./slices/ChatSlice"
import configReducer from "./slices/ConfigSlice"

export const store = configureStore({
  reducer: {
    auth: authReducer,
    chatCount : chatCountReducer,
    config : configReducer
  },
})

// Types for TypeScript (optional but recommended)
export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
