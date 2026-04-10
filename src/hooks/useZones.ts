import { getZones, getProductsByZone } from "@/services/zones";
import { useQuery } from "@tanstack/react-query";

export const useGetZones = () => {
  return useQuery({
    queryKey: ["zones"],
    queryFn: getZones,
  });
};

export const useGetProductsByZone = (zoneId: string) => {
  return useQuery({
    queryKey: ["products-by-zone", zoneId],
    queryFn: () => getProductsByZone(zoneId),
    enabled: !!zoneId,
  });
};