import api from "@/lib/axios";

export const getBrand = async () => {
  const { data } = await api.get("/brands");
  return data.data;
};