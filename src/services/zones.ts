import api from "@/lib/axios";

export const getZones = async () => {
  const { data } = await api.get("/products-state");
  return data.data;
};

export const getProductsByZone = async (zoneId: string) => {
  const { data } = await api.get(`/zones/${zoneId}/products`);
  return data.data;
};