import { ConfigData } from "@/types/config";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface ConfigState {
  data: ConfigData | null;
}

const initialState: ConfigState = {
  data: null,
};

const configSlice = createSlice({
  name: "config",
  initialState,
  reducers: {
    setConfig: (state, action: PayloadAction<ConfigData>) => {
      state.data = action.payload;
    },
  },
});

export const { setConfig } = configSlice.actions;
export default configSlice.reducer;
