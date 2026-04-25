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

export const getBusinessProducts = async (filters: ProductFilters = {}) => {
  const cleanedFilters = {
    ...filters,
    min_price: filters.min_price === "0" ? null : filters.min_price,
    max_price: filters.max_price === "0" ? null : filters.max_price,
  };

  const { data } = await api.get("/business-products", {
    params: cleanedFilters
  });

  return data;
}

export const getBusinessProduct = async (id: string) => {
  const { data } = await api.get(`/business-product-details/${id}`)
  return data
}


export const getUserProducts = async (page: number, status?: string) => {
  const params = new URLSearchParams({
    page: page.toString(),
    per_page: "10",
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

export const activateProduct = async (id: string) => {
  const { data } = await api.post(`/activate-product/${id}`);
  return data.data;
};

export const deactivateProduct = async (id: string) => {
  const { data } = await api.post(`/deactivate-product/${id}`);
  return data.data;
};

export const makeProductFeatured = async (productId: string) => {
  const { data } = await api.post("/make-product-featured", { product_id: productId });
  return data;
};

export const getSellerProducts = async (filters: ProductFilters = {}) => {
  const { data } = await api.get("/seller-products", {
    params: {
      ...filters
    }
  })
  return data
}

export const getFeaturedProducts = async (filters: ProductFilters = {}) => {
  const { data } = await api.get("/featured-products", {
    params: {
      ...filters
    }
  })
  return data
};

export const getMyTierInfo = async () => {
  const { data } = await api.get("/my-tier-info");
  return data.data;
};

export const activateExtraAd = async () => {
  const { data } = await api.post("/activate-extra-ad");
  return data;
};
