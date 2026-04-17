import api from "@/lib/axios";

export interface RegisterBusinessPayload {
  display_name: string;
  contact_number: string;
  lat: number | undefined;
  lng: number | undefined;
  email: string;
  password: string;
  address: string;
}

export const registerBusiness = async (form: RegisterBusinessPayload) => {
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