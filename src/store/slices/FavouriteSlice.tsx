"use client";

import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface FavoriteItem {
  id: number;
  name: string;
  price: number;
  image: string;
  details?: string[];
  businessId: number;
}

interface FavoriteState {
  items: FavoriteItem[];
}

const isClient = typeof window !== "undefined";

const getInitialFavorites = (): FavoriteItem[] => {
  if (!isClient) return [];
  return JSON.parse(localStorage.getItem("favorites") || "[]");
};

const initialState: FavoriteState = {
  items: getInitialFavorites(),
};

export const favoritesSlice = createSlice({
  name: "favorites",
  initialState,
  reducers: {
    toggleFavorite: (state, action: PayloadAction<FavoriteItem>) => {
      const index = state.items.findIndex((item) => item.id === action.payload.id);
      if (index >= 0) {
        state.items.splice(index, 1);
      } else {
        state.items.push(action.payload);
      }
      localStorage.setItem("favorites", JSON.stringify(state.items));
    },
    removeFromFavorites: (state, action: PayloadAction<number>) => {
      state.items = state.items.filter((item) => item.id !== action.payload);
      localStorage.setItem("favorites", JSON.stringify(state.items));
    },
  },
});

export const { toggleFavorite, removeFromFavorites } = favoritesSlice.actions;
export default favoritesSlice.reducer;