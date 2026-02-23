import { useQuery } from "@tanstack/react-query";
import { getRequiredDocuments, registerBusiness, saveBusinessDocument } from "@/services/business";
import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { toast } from "@/components/ui/toast";

export const useRegisterBusiness = () => {
  return useMutation({
    mutationFn: registerBusiness,
    onSuccess: () => {
      toast({
        title: "Business Registration Successful"
      });
      // router.push("/business-management/");
    },
    onError: (err: any) => {
      console.log(err)
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
  return useMutation({
    mutationFn: saveBusinessDocument,
    onSuccess: () => {
      toast({
        title: "Business Document Saved Successfully"
      });
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
