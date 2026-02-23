import { useQuery } from "@tanstack/react-query";
import { getRequiredDocuments } from "@/services/business";

export const useGetRequiredDocuments = () => {
  return useQuery({
    queryKey: ["business"],
    queryFn: getRequiredDocuments,
  });
};
