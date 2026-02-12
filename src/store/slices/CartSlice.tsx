"use client";

import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { CartItem } from "@/types/cart";

interface CartState {
  items: CartItem[];
  totalItems: number; // Added totalItems length
}

const isClient = typeof window !== "undefined";

const getInitialItems = (): CartItem[] => {
  if (!isClient) return [];
  return JSON.parse(localStorage.getItem("cart") || "[]");
};

const initialState: CartState = {
  items: getInitialItems(),
  totalItems: getInitialItems().length, // Initialize with current length
};

export const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart: (state, action: PayloadAction<CartItem>) => {
      const existingItem = state.items.find((item) => item.id === action.payload.id);
      if (existingItem) {
        existingItem.quantity += 1;
      } else {
        state.items.push(action.payload);
      }
      // Update length and storage
      state.totalItems = state.items.length;
      localStorage.setItem("cart", JSON.stringify(state.items));
    },
    removeFromCart: (state, action: PayloadAction<number>) => {
      state.items = state.items.filter((item) => item.id !== action.payload);
      // Update length and storage
      state.totalItems = state.items.length;
      localStorage.setItem("cart", JSON.stringify(state.items));
    },
    updateQuantity: (state, action: PayloadAction<{ id: number; quantity: number }>) => {
      const item = state.items.find((item) => item.id === action.payload.id);
      if (item) {
        item.quantity = action.payload.quantity;
      }
      localStorage.setItem("cart", JSON.stringify(state.items));
    },
    clearCart: (state) => {
      state.items = [];
      state.totalItems = 0; // Reset length
      localStorage.removeItem("cart");
    },
  },
});

export const { addToCart, removeFromCart, updateQuantity, clearCart } = cartSlice.actions;
export default cartSlice.reducer;