// lib/api.ts
import axios from "axios";
import { baseURL } from "@/config/constants";

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


api.interceptors.response.use(
  (response) => response, // Pass through successful responses
  (error) => {
    if (error.response && error.response.status === 401) {
      // 1. Clear Local Storage
      localStorage.removeItem("token");

      // 2. Redirect to Login
      // Using window.location is often safer in interceptors to 
      // ensure a full state reset, but you can also use your router.
      window.location.href = "/auth/login";
    }
    return Promise.reject(error);
  }
);
// ✅ Handle 401 and 429 errors
// api.interceptors.response.use(
//   (response) => response,
//   (error) => {
//     const status = error.response?.status;
//     if (status === 401 && error?.message === "Request failed with status code 401") {
//       // toast({
//       //   title: "Token Expired",
//       //   variant: "destructive",
//       // });

//       // if (typeof window !== "undefined") {
//       //   window.dispatchEvent(new Event("unauthorized"));
//       // }
//     }

//     if (status === 429) {
//       toast({
//         title: "Chat Limit Reached",
//         description: "You have reached the maximum number of messages allowed. Please wait before sending more.",
//         variant: "destructive",
//       });
//     }

//     return Promise.reject(error);
//   }
// );

export default api;
