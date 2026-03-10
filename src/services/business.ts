import api from "@/lib/axios";
import { BusinessDocumentForm } from "@/types/business";
import { BusinessDetailsValues } from "@/validations/business";

export const registerBusiness = async (form: BusinessDetailsValues) => {
  const { data } = await api.post("/business-register", form);
  return data.data;
};

export const getRequiredDocuments = async () => {
  const { data } = await api.get("/document-list");
  return data.data;
};

export const saveBusinessDocument = async (form: FormData) => {
  const { data } = await api.post("/user-document-save", form, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return data;
};