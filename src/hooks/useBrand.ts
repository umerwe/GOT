import { useQuery } from "@tanstack/react-query";
import { getBrand } from "@/services/brand";

export const useGetBrands = (items_brand ?: number) => {
  return useQuery({
    queryKey: ["brands"],
    queryFn: () => getBrand(items_brand),
  });
};
