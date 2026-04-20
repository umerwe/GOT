// hooks/favorites/useWishlist.ts
"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toggleWishlist, getWishlist } from "@/services/favorites/wishlist";
import { toast } from "@/components/ui/toast";
import { AxiosError } from "axios";

export const useGetWishlist = () => {
  return useQuery({
    queryKey: ["wishlist"],
    queryFn: getWishlist,
    enabled: typeof window !== "undefined" && !!localStorage.getItem("token"),
    staleTime: 5 * 60 * 1000
  });
};


export const useToggleWishlist = () => {
  const query = useQueryClient();
  return useMutation({
    mutationFn: toggleWishlist,
    onSuccess: (data) => {
      const message = data?.message !== "Product removed from your wishlist."
        ? "Added to wishlist"
        : "Removed from wishlist";

        query.invalidateQueries({ queryKey: ["wishlist"] });
      toast({
        title: message,
      });
    },
    onError: (err: AxiosError<{ message: string }>) => {
      toast({
        title: "Wishlist Update Failed",
        description: err?.response?.data?.message || "Something went wrong",
        variant: "destructive",
      });
    },
  });
};