import api from "@/lib/axios";
import { isAxiosError } from "axios";
import {
  CheckPasswordForm,
  ConfirmToken,
  ForgotPasswordForm,
  NewPasswordForm,
  RequestConfirmationCodeForm,
  UserLoginForm,
  UserRegistrationForm,
  userSchema,
} from "../types";

// Envía una solicitud para crear una nueva cuenta de usuario.
export async function createAccount(formData: UserRegistrationForm) {
  try {
    const url = "/auth/create-account";
    const { data } = await api.post<string>(url, formData);
    return data;
  } catch (error) {
    if (isAxiosError(error) && error.response) {
      throw new Error(error.response.data.error);
    }
  }
}
//  Confirma una cuenta de usuario usando un token.
export async function confirmAccount(formData: ConfirmToken) {
  try {
    const url = "/auth/confirm-account";
    const { data } = await api.post<string>(url, formData);
    return data;
  } catch (error) {
    if (isAxiosError(error) && error.response) {
      throw new Error(error.response.data.error);
    }
  }
}
// Solicita un código de confirmación para un usuario.
export async function requestConfirmationCode(
  formData: RequestConfirmationCodeForm
) {
  try {
    const url = "/auth/request-code";
    const { data } = await api.post<string>(url, formData);
    return data;
  } catch (error) {
    if (isAxiosError(error) && error.response) {
      throw new Error(error.response.data.error);
    }
  }
}
// Autentica al usuario y almacena el token en el almacenamiento local
export async function authenticateUser(formData: UserLoginForm) {
  try {
    const url = "/auth/login";
    const { data } = await api.post<string>(url, formData);
    localStorage.setItem("AUTH_TOKEN", data);
    return data;
  } catch (error) {
    if (isAxiosError(error) && error.response) {
      throw new Error(error.response.data.error);
    }
  }
}
//Solicita el restablecimiento de la contraseña.
export async function forgotPassword(formData: ForgotPasswordForm) {
  try {
    const url = "/auth/forgot-password";
    const { data } = await api.post<string>(url, formData);
    return data;
  } catch (error) {
    if (isAxiosError(error) && error.response) {
      throw new Error(error.response.data.error);
    }
  }
}

//Valida un token para restablecimiento de contraseña o confirmación de cuenta.
export async function validateToken(formData: ConfirmToken) {
  try {
    const url = "/auth/validate-token";
    const { data } = await api.post<string>(url, formData);
    return data;
  } catch (error) {
    if (isAxiosError(error) && error.response) {
      throw new Error(error.response.data.error);
    }
  }
}

// Actualiza la contraseña utilizando un token de restablecimiento.
export async function updatePasswordWithToken({
  formData,
  token,
}: {
  formData: NewPasswordForm;
  token: ConfirmToken["token"];
}) {
  try {
    const url = `/auth/update-password/${token}`;
    const { data } = await api.post<string>(url, formData);
    return data;
  } catch (error) {
    if (isAxiosError(error) && error.response) {
      throw new Error(error.response.data.error);
    }
  }
}
//  Obtiene los datos del usuario autenticado
export async function getUser() {
  try {
    const { data } = await api("/auth/user");
    const response = userSchema.safeParse(data);
    if (response.success) {
      return response.data;
    }

    return data;
  } catch (error) {
    if (isAxiosError(error) && error.response) {
      throw new Error(error.response.data.error);
    }
  }
}

//Verifica la contraseña actual del usuario.
export async function checkPassword(formData: CheckPasswordForm) {
  try {
    const url = "/auth/check-password";
    const { data } = await api.post<string>(url, formData);
    return data;
  } catch (error) {
    if (isAxiosError(error) && error.response) {
      throw new Error(error.response.data.error);
    }
  }
}
