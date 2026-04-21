import api from "@/lib/axios";

export const getNotifications = async () => {
  const { data } = await api.post("/notification-list?type=markas_read");
  return data;
};