import { useQuery } from "@tanstack/react-query";
import { getBrand } from "@/services/brand";

export const useGetBrands = () => {
  return useQuery({
    queryKey: ["brands"],
    queryFn: getBrand,
  });
};
