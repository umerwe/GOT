import { toast } from "@/components/ui/toast";
import { saveOrder } from "@/services/order";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { useRouter } from "next/navigation";
import { getOrderList } from "@/services/order";
import { useAppDispatch } from "@/store/hooks";
import { clearCart } from "@/store/slices/CartSlice";

export const useGetOrderList = (currentPage: number = 1) => {
  return useQuery({
    queryKey: ["order-list", currentPage],
    queryFn: () => getOrderList(currentPage),
  });
};
export const useSaveOrder = () => {
    const queryClient = useQueryClient()
const dispatch = useAppDispatch();
    return useMutation({
        mutationFn: saveOrder,
        onSuccess: async (data) => {

         
dispatch(clearCart());
            // Redirect immediately
            queryClient.invalidateQueries({ queryKey: ["order-list"] })
        },

        onError: (err: AxiosError<{ message: string }>) => {
            toast({
                title: "Order Failed",
                description: `${err?.response?.data?.message}`,
                variant: "destructive",
            });
        },
    });
};