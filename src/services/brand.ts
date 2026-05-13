import api from "@/lib/axios";

export const getBrand = async (items_brand?: number) => {
  const params = items_brand ? { items_brand } : {};
  const { data } = await api.get("/brands", { params });
  return data.data;
};