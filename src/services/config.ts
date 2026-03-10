import api from "@/lib/axios";

export const getConfig = async () => {
  const { data } = await api.get("/config");
  return data;
}
