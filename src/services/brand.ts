import api from "@/lib/axios";

export const getBrand = async (items_brand: number = 0) => {
  const { data } = await api.get(`/brands?items_brand=${items_brand}`);
  return data.data;
};