import { getProfile, updateProfile } from "@/services/profile";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "@/components/ui/toast";
import { AxiosError } from "axios";

export const useGetProfile = () => {
  return useQuery({
    queryKey: ["profile"],
    queryFn: getProfile,
  });
};

export const useUpdateProfile = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateProfile,
    onSuccess: () => {
      toast({
        title: "Profile Updated",
        description: "Your profile has been successfully updated!",
      });
      queryClient.invalidateQueries({ queryKey: ["profile"] });
    },
    onError: (err: AxiosError<{ message: string }>) => {
      toast({
        title: "Failed to Update Profile",
        description: `${err?.response?.data?.message}`,
        variant: "destructive",
      });
    },
  });
};