// lib/api.ts
import axios from "axios";
import { baseURL } from "@/config/constants";
import { toast } from "@/components/ui/toast";

const api = axios.create({
  baseURL,
});

// ✅ Add token automatically
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ✅ Handle 401 and 429 errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;

    if (status === 401) {
      toast({
        title: "Token Expired",
        variant: "destructive",
      });

      if (typeof window !== "undefined") {
        window.dispatchEvent(new Event("unauthorized"));
      }
    }

    if (status === 429) {
      toast({
        title: "Chat Limit Reached",
        description: "You have reached the maximum number of messages allowed. Please wait before sending more.",
        variant: "destructive",
      });
    }

    return Promise.reject(error);
  }
);

export default api;
