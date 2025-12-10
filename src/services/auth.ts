import api from "@/lib/axios"
import { SignUp, Login } from "@/validations/auth"

export const login = async (form: Login) => {
  const { data } = await api.post("/login", form)
  return { userId: data.data.id, auth_token: data.data.auth_token }
}

export const signup = async (form: SignUp) => {
  const { data } = await api.post("/register", form)
  return data;
}

export const forgetPassword = async (email : string) => {
  const { data } = await api.post("/forget-password", { email })
  return data;
}
