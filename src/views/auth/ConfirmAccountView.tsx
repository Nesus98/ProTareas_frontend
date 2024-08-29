import { Link, useNavigate } from "react-router-dom";
import { PinInput, PinInputField } from "@chakra-ui/pin-input";
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { ConfirmToken } from "@/types/index";
import { confirmAccount } from "@/api/AuthAPI";
import { toast } from "react-toastify";

export default function ConfirmAccountView() {
  // Se utiliza useState para manejar el estado del token de confirmación.
  // Este estado almacenará el token que el usuario introduce.
  const [token, setToken] = useState<ConfirmToken["token"]>("");
  const navigate = useNavigate();

  //Redirecciona al usuario
  const { mutate } = useMutation({
    mutationFn: confirmAccount,
    onError: (error) => {
      toast.error(error.message);
    },
    onSuccess: (data) => {
      toast.success(data, {
        autoClose: 2500,
      });
      setTimeout(() => {
        navigate("/");
      }, 3000);
    },
  });
  // Función que se llama cada vez que el token cambia.
  // Se actualiza el estado del token con el nuevo valor introducido por el usuario.
  const handleChange = (token: ConfirmToken["token"]) => {
    setToken(token);
  };

  // Función que se llama cuando el usuario completa la introducción del token.
  // Esta función ejecuta la mutación para confirmar la cuenta con el token proporcionado.
  const handleComplete = (token: ConfirmToken["token"]) => mutate({ token });
  return (
    <>
      <h1 className="text-5xl font-black text-white">Confirma tu Cuenta</h1>
      <p className="text-2xl font-light text-white mt-5">
        Ingresa el código que recibiste {""}
        <span className=" text-fuchsia-500 font-bold"> por e-mail</span>
      </p>
      <form className="space-y-8 p-10 bg-white mt-10">
        <label className="font-normal text-2xl text-center block">
          Código de 6 dígitos
        </label>
        <div className="flex justify-center gap-5">
          <PinInput
            value={token}
            onChange={handleChange}
            onComplete={handleComplete}
          >
            <PinInputField className="w-10 h-10 p-3 rounded-lg border-gray-300 border placeholder-white" />
            <PinInputField className="w-10 h-10 p-3 rounded-lg border-gray-300 border placeholder-white" />
            <PinInputField className="w-10 h-10 p-3 rounded-lg border-gray-300 border placeholder-white" />
            <PinInputField className="w-10 h-10 p-3 rounded-lg border-gray-300 border placeholder-white" />
            <PinInputField className="w-10 h-10 p-3 rounded-lg border-gray-300 border placeholder-white" />
            <PinInputField className="w-10 h-10 p-3 rounded-lg border-gray-300 border placeholder-white" />
          </PinInput>
        </div>
      </form>

      <nav className="mt-10 flex flex-col space-y-4">
        <Link
          to="/auth/request-code"
          className="text-center text-gray-300 font-normal"
        >
          Solicitar un nuevo Código
        </Link>
      </nav>
    </>
  );
}
