import { useQuery } from "@tanstack/react-query";
import { getConfig } from "@/services/config";

export const useGetConfig = () => {
    return useQuery({
        queryKey: ["config"],
        queryFn: getConfig,
    });
};
