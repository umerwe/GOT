import api from "@/lib/axios";

export const getProfile = async () => {
  const { data } = await api.get("/user-detail");
  return data.data;
};

export const updateProfile = async (formData: ProfileProps) => {
  const { data } = await api.post("/update-profile", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return data.data;
};

