import api from "@/lib/axios";

export const chatInbox = async () => {
  const { data } = await api.get("/message/inbox");
  return data.data;
};

export const getMessages = async (receiver_id: string) => {
  const { data } = await api.get(`/message/get?receiver_id=${receiver_id}`);
  return data.data;
};


export const sendMessage = async (formData: FormData) => {
  const { data } = await api.post("/message/send", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  })
  return data.data
}