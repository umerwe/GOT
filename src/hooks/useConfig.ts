import { useQuery } from "@tanstack/react-query";
import { getConfig } from "@/services/config";

export const useGetConfig = () => {
  return useQuery({
    queryKey: ["config"],
    queryFn: getConfig,

    staleTime: Infinity,
    gcTime: Infinity,

    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
  });
};
