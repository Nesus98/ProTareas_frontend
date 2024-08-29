import { useForm } from "react-hook-form";
import { useParams } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import ErrorMessage from "../ErrorMessage";
import { TeamMemberForm } from "@/types/index";
import { findUserByEmail } from "@/api/TeamAPI";
import SearchResult from "./SearchResult";

export default function AddMemberForm() {
  // Define los valores iniciales para el formulario de miembro del equipo
  const initialValues: TeamMemberForm = {
    email: "",
  };

  // Hook para acceder a los parámetros de la URL en la aplicación React
  const params = useParams();

  // Obtiene el ID del proyecto desde los parámetros de la URL
  const projectId = params.projectId!;

  // Hook para manejar el formulario, con valores iniciales y gestión de errores
  const {
    register, // Función para registrar inputs del formulario
    handleSubmit, // Función para manejar el envío del formulario
    reset, // Función para reiniciar el formulario
    formState: { errors }, // Estado del formulario, incluyendo errores
  } = useForm({ defaultValues: initialValues });

  // Hook para realizar una mutación con React Query
  const mutation = useMutation({
    mutationFn: findUserByEmail,
  });

  // Función para manejar la búsqueda de un usuario cuando se envía el formulario
  const handleSearchUser = async (formData: TeamMemberForm) => {
    const data = { projectId, formData };

    mutation.mutate(data);
  };

  // Función para reiniciar el formulario y la mutación
  const resetData = () => {
    reset(); // Reinicia los valores del formulario a los valores iniciales
    mutation.reset(); // Reinicia el estado de la mutación
  };

  return (
    <>
      <form
        className="mt-10 space-y-5"
        onSubmit={handleSubmit(handleSearchUser)}
        noValidate
      >
        <div className="flex flex-col gap-3">
          <label className="font-normal text-2xl" htmlFor="name">
            E-mail de Usuario
          </label>
          <input
            id="name"
            type="text"
            placeholder="E-mail del usuario a Agregar"
            className="w-full p-3  border-gray-300 border"
            {...register("email", {
              required: "El Email es obligatorio",
              pattern: {
                value: /\S+@\S+\.\S+/,
                message: "E-mail no válido",
              },
            })}
          />
          {errors.email && <ErrorMessage>{errors.email.message}</ErrorMessage>}
        </div>

        <input
          type="submit"
          className=" bg-fuchsia-600 hover:bg-fuchsia-700 w-full p-3  text-white font-black  text-xl cursor-pointer"
          value="Buscar Usuario"
        />
      </form>
      <div className="mt-10">
        {mutation.isPending && <p className="text-center">Cargando...</p>}
        {mutation.error && (
          <p className="text-center">{mutation.error.message}</p>
        )}
        {mutation.data && (
          <SearchResult user={mutation.data} reset={resetData} />
        )}
      </div>
    </>
  );
}
