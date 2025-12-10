import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

interface AuthState {
  token: string | null;
  userId: string | null;
}

const initialState: AuthState = {
  token: typeof window !== "undefined" ? localStorage.getItem("token") : null,
  userId: typeof window !== "undefined" ? localStorage.getItem("userId") : null,
};

interface AuthPayload {
  userId: string;
  auth_token: string;
}

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUserData: (state, action: PayloadAction<AuthPayload>) => {
      state.userId = action.payload.userId;
      state.token = action.payload.auth_token;
      if (typeof window !== "undefined") {
        localStorage.setItem("token", action.payload.auth_token);
        localStorage.setItem("userId", action.payload.userId);
      }
    },
    logout: (state) => {
      state.token = null;
      state.userId = null;
      if (typeof window !== "undefined") {
        localStorage.clear();
      }
    },
  },
});

export const { setUserData, logout } = authSlice.actions;
export default authSlice.reducer;