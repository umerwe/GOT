import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getProducts, getUserProducts, getProduct, addProduct, updateUserProduct, deleteUserProduct, getVendorProducts, getVendorProduct } from "@/services/products";
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

export const useGetVendorProducts = (
  filters?: ProductFilters,
  options?: { enabled?: boolean }
) => {
  return useQuery({
    queryKey: ["vendorProducts", filters],
    queryFn: () => getVendorProducts(filters),
    enabled: options?.enabled ?? true,
  })
}

export const useGetVendorProduct = (
  id: string,
  options?: { enabled?: boolean }
) => {
  return useQuery({
    queryKey: ["vendorProduct", id],
    queryFn: () => getVendorProduct(id),
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
  const router = useRouter()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: addProduct,
    onSuccess: () => {
      toast({
        title: "Product Added",
        description: "Your product has been successfully added!",
      })
      router.push("/post-ad/thank-you")
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