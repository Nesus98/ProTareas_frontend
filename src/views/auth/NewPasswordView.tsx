import { useState } from "react";
import NewPasswordToken from "./NewPasswordToken";
import NewPasswordForm from "./NewPasswordForm";
import { ConfirmToken } from "@/types/index";

export default function NewPasswordView() {
  // Estado para almacenar el valor del token ingresado por el usuario.
  // Se inicializa como una cadena vacía.
  const [token, setToken] = useState<ConfirmToken["token"]>("");

  // Estado para almacenar si el token ingresado es válido 
  const [isValidToken, setIsValidToken] = useState(false);
  return (
    <>
      <h1 className="text-5xl font-black text-white">Reestablecer Password</h1>
      <p className="text-2xl font-light text-white mt-5">
        Ingresa el codigo que recibiste {""}
        <span className=" text-fuchsia-500 font-bold">por email</span>
      </p>

      {!isValidToken ? (
        <NewPasswordToken
          token={token}
          setToken={setToken}
          setIsValidToken={setIsValidToken}
        />
      ) : (
        <NewPasswordForm token={token} />
      )}
    </>
  );
}
