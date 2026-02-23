import api from "@/lib/axios";

export const getRequiredDocuments = async () => {
  const { data } = await api.get("/document-list");
  return data.data;
};