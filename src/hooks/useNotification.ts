import { useQuery } from "@tanstack/react-query";
import { getNotifications } from "@/services/notification";

export const useGetNotifications = () => {
  return useQuery({
    queryKey: ["notifications"],
    queryFn: () => getNotifications(),
  });
};