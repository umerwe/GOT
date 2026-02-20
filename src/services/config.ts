import api from "@/lib/axios";
import { setConfig } from "@/store/slices/ConfigSlice";
import { store } from "@/store/store";

export const getConfig = async () => {
  try {
    const { data } = await api.get("/config");
    // ✅ save into Redux
    store.dispatch(setConfig(data));

    return data; // still return for react-query
  } catch (error) {
    console.error("❌ Failed to fetch config:", error);
    throw error; // rethrow so react-query can catch it
  }
};
