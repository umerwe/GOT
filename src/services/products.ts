// @/services/products.ts
import api from "@/lib/axios";

export const getProducts = async (filters: ProductFilters = {}) => {
  const { data } = await api.get("/products", {
    params: {
      ...filters
    }
  })
  return data
}


export const getUserProducts = async (page: number, status?: string) => {
  const params = new URLSearchParams({
    page: page.toString(),
    per_page: "5",
  })

  if (status) {
    params.append("status", status)
  }

  const { data } = await api.get(`/product-list?${params}`)
  return data
}


export const getProduct = async (id: string) => {
  const { data } = await api.get(`/product-details/${id}`);
  return data.data;
};

export const addProduct = async (productData: FormData) => {
  const { data } = await api.post("/save-product", productData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  })
  return data.data
}

export const updateUserProduct = async (id: number, formData: FormData) => {
  const { data } = await api.post(`/update-product/${id}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return data.data;
};

export const deleteUserProduct = async (id: number) => {
  const { data } = await api.post(`/delete-product/${id}`);
  return data.data;
};
