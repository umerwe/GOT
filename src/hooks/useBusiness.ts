import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getRequiredDocuments, registerBusiness, saveBusinessDocument } from "@/services/business";
import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { toast } from "@/components/ui/toast";
import { useRouter } from "next/navigation";
import { useAppDispatch } from "@/store/hooks";
import { setUserData } from "@/store/slices/AuthSlice";

export const useRegisterBusiness = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: registerBusiness,
    onSuccess: (data) => {
      dispatch(setUserData(data));
      localStorage.setItem("token", data.auth_token);
      queryClient.invalidateQueries({ queryKey: ["profile"] })
      toast({
        title: "Business Registration Successful"
      });
      router.push("/business-management/verification");
    },
    onError: (err: AxiosError<{ message: string }>) => {
      toast({
        title: "Business Registration Failed",
        description: `${err?.response?.data?.message}`,
        variant: "destructive",
      });
    },
  });
};


export const useGetRequiredDocuments = () => {
  return useQuery({
    queryKey: ["business"],
    queryFn: getRequiredDocuments,
  });
};

export const useSaveBusinessDocument = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: saveBusinessDocument,
    onSuccess: () => {
      toast({
        title: "Business Document Saved Successfully"
      });
      queryClient.invalidateQueries({ queryKey: ["business"] });
    },
    onError: (err: AxiosError<{ message: string }>) => {
      toast({
        title: "Business Document Save Failed",
        description: `${err?.response?.data?.message}`,
        variant: "destructive",
      });
    },
  });
}
