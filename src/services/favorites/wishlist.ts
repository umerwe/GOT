import api from "@/lib/axios"

export const toggleWishlist = async (itemId: string) => {
  const { data } = await api.post("/wishlist-toggle", { product_id: itemId })
  return data;
}

export const getWishlist = async () => {
  const { data } = await api.get("/wishlist")
  return data;
}
