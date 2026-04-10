import { configureStore } from "@reduxjs/toolkit"
import authReducer from "./slices/AuthSlice"
import chatCountReducer from "./slices/ChatSlice"
import cartReducer from "./slices/CartSlice"
import favoritesReducer from "./slices/FavouriteSlice"

export const store = configureStore({
  reducer: {
    auth: authReducer,
    chatCount: chatCountReducer,
    cart: cartReducer,
    favorites: favoritesReducer,
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch