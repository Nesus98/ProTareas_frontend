import { isAxiosError } from "axios";
import { UpdateCurrentUserPasswordForm, UserProfileForm } from "../types";
import api from "@/lib/axios";

//Actualizar perfil
export async function updateProfile(formData: UserProfileForm) {
  try {
    const { data } = await api.put<string>("/auth/profile", formData);
    return data;
  } catch (error) {
    if (isAxiosError(error) && error.response) {
      // Lanzar un error con el mensaje de error de la respuesta
      throw new Error(error.response.data.error);
    }
  }
}

//Cambiar contraseña
export async function changePassword(formData: UpdateCurrentUserPasswordForm) {
  try {
    const { data } = await api.post<string>("/auth/update-password", formData);
    return data;
  } catch (error) {
    if (isAxiosError(error) && error.response) {
      // Lanzar un error con el mensaje de error de la respuesta
      throw new Error(error.response.data.error);
    }
  }
}
