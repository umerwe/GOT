import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getProducts, getUserProducts, getProduct, addProduct, updateUserProduct, deleteUserProduct, getBusinessProducts, getBusinessProduct, activateProduct, deactivateProduct, makeProductFeatured, getSellerProducts, getFeaturedProducts, getMyTierInfo, activateExtraAd } from "@/services/products";
import { toast } from "@/components/ui/toast";
import { useRouter } from "next/navigation";
import { AxiosError } from "axios";

export const useGetProducts = (
  filters?: ProductFilters,
  options?: { enabled?: boolean }
) => {
  return useQuery({
    queryKey: ["products", filters],
    queryFn: () => getProducts(filters),
    enabled: options?.enabled ?? true,
  })
}

export const useGetBusinessProducts = (
  filters?: ProductFilters,
  options?: { enabled?: boolean }
) => {
  return useQuery({
    queryKey: ["businessProducts", filters],
    queryFn: () => getBusinessProducts(filters),
    enabled: options?.enabled ?? true,
  })
}

export const useGetSellerProducts = (
  filters?: ProductFilters,
  options?: { enabled?: boolean }
) => {
  return useQuery({
    queryKey: ["sellerProducts", filters],
    queryFn: () => getSellerProducts(filters),
    enabled: options?.enabled ?? true,
  })
}

export const useGetBusinessProduct = (
  id: string,
  options?: { enabled?: boolean }
) => {
  return useQuery({
    queryKey: ["businessProduct", id],
    queryFn: () => getBusinessProduct(id),
    enabled: options?.enabled ?? true,
  })
}


export const useGetUserProducts = (page = 1, status?: string) => {
  return useQuery({
    queryKey: ["userProducts", page, status],
    queryFn: () => getUserProducts(page, status),
  })
}

export const useGetProduct = (id: string) => {
  return useQuery({
    queryKey: ["product", id],
    queryFn: () => getProduct(id),
  });
};

export const useAddProduct = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: addProduct,
    onSuccess: () => {
       toast({
        title: "Product Added Successfully"
      })
      queryClient.invalidateQueries({ queryKey: ["userProducts"] })
      queryClient.invalidateQueries({ queryKey: ["products"] })
    },
    onError: (err: AxiosError<{ message: string }>) => {
      toast({
        title: "Failed to Add Product",
        description: `${err?.response?.data?.message}`,
        variant: "destructive",
      })
    },
  })
}

export const useUpdateUserProduct = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, formData }: { id: number; formData: FormData }) => updateUserProduct(id, formData),
    onSuccess: () => {
      toast({
        title: "Product Updated",
        description: "Your product has been successfully updated!",
      });
      queryClient.invalidateQueries({ queryKey: ["userProducts"] });
      queryClient.invalidateQueries({ queryKey: ["products"] });
      queryClient.invalidateQueries({ queryKey: ["product"] });
    },
    onError: (err: AxiosError<{ message: string }>) => {
      toast({
        title: "Failed to Update Product",
        description: `${err?.response?.data?.message}`,
        variant: "destructive",
      });
    },
  });
};

export const useDeleteUserProducts = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteUserProduct,
    onSuccess: () => {
      toast({
        title: "Product Deleted",
        description: "Your product has been successfully deleted!",
      });
      queryClient.invalidateQueries({ queryKey: ["userProducts"] });
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
    onError: (err: AxiosError<{ message: string }>) => {
      toast({
        title: "Failed to Delete Product",
        description: `${err?.response?.data?.message}`,
        variant: "destructive",
      });
    },
  });
};

export const useActivateProduct = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: activateProduct,
    onSuccess: () => {
      toast({
        title: "Product Activated",
        description: "Your product has been successfully activated!",
      });
      queryClient.invalidateQueries({ queryKey: ["userProducts"] });
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
    onError: (err: AxiosError<{ message: string }>) => {
      toast({
        title: "Failed to Activate Product",
        description: `${err?.response?.data?.message}`,
        variant: "destructive",
      });
    },
  });
};

export const useDeactivateProduct = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deactivateProduct,
    onSuccess: () => {
      toast({
        title: "Product Deactivated",
        description: "Your product has been successfully deactivated!",
      });
      queryClient.invalidateQueries({ queryKey: ["userProducts"] });
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
    onError: (err: AxiosError<{ message: string }>) => {
      toast({
        title: "Failed to Deactivate Product",
        description: `${err?.response?.data?.message}`,
        variant: "destructive",
      });
    },
  });
};

export const useMakeProductFeatured = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (productId: string) => makeProductFeatured(productId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["userProducts"] });
      queryClient.invalidateQueries({ queryKey: ["products"] });
      queryClient.invalidateQueries({ queryKey: ["product"] });
    },
    onError: (err: AxiosError<{ message: string }>) => {
      toast({
        title: "Failed to Feature Product",
        description: `${err?.response?.data?.message}`,
        variant: "destructive",
      });
    },
  });
};

export const useGetFeaturedProducts = (filters?: ProductFilters) => {
  return useQuery({
    queryKey: ["featuredProducts", filters],
    queryFn: () => getFeaturedProducts(filters),
  });
};

export const useGetMyTierInfo = () => {
  return useQuery({
    queryKey: ["myTierInfo"],
    queryFn: () => getMyTierInfo(),
  });
};

export const useActivateExtraAd = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: activateExtraAd,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["myTierInfo"] });
    },
    onError: (err: AxiosError<{ message: string }>) => {
      toast({
        title: "Failed to Activate Extra Ad",
        description: `${err?.response?.data?.message}`,
        variant: "destructive",
      });
    },
  });
};