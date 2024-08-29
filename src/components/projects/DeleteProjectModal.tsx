import { Fragment } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { useNavigate, useLocation } from "react-router-dom";
import { useForm } from "react-hook-form";
import ErrorMessage from "../ErrorMessage";
import { CheckPasswordForm } from "@/types/index";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { checkPassword } from "@/api/AuthAPI";
import { toast } from "react-toastify";
import { deleteProject } from "@/api/ProjectAPI";

export default function DeleteProjectModal() {
  // Valores iniciales para el formulario de verificación de contraseña
  const initialValues: CheckPasswordForm = {
    password: "",
  };

  // Hook para obtener la ubicación actual, incluyendo parámetros de consulta en la URL
  const location = useLocation();

  // Hook para redirigir a diferentes rutas en la aplicación
  const navigate = useNavigate();

  // Obtiene los parámetros de consulta de la URL
  const queryParams = new URLSearchParams(location.search);

  // Extrae el ID del proyecto que se desea eliminar de los parámetros de consulta
  const deleteProjectId = queryParams.get("deleteProject")!;

  // Determina si se debe mostrar la interfaz para eliminar un proyecto en función de la presencia del ID
  const show = deleteProjectId ? true : false;

// Inicializa el hook useForm con los valores predeterminados para el formulario
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ defaultValues: initialValues });

  // Hook para acceder y manipular el caché de queries de react-query
  const queryClient = useQueryClient();

  // Configuración del hook useMutation para verificar la contraseña del usuario
  const checkUserPasswordMutation = useMutation({
    mutationFn: checkPassword,
    onError: (error) => toast.error(error.message),
  });

  // Configuración del hook useMutation para eliminar un proyecto
  const deleteProjectMutation = useMutation({
    mutationFn: deleteProject, // Función para eliminar el proyecto
    onError: (error) => {
      toast.error(error.message); // Muestra un mensaje de error si la eliminación falla
    },
    onSuccess: (data) => {
      toast.success(data); // Muestra un mensaje de éxito si la eliminación es exitosa
      queryClient.invalidateQueries({ queryKey: ["projects"] }); // Invalida el caché de proyectos para que se actualice
      navigate(location.pathname, { replace: true });
    },
  });

  // Función que maneja el envío del formulario, incluyendo la verificación de la contraseña y la eliminación del proyecto
  const handleForm = async (formData: CheckPasswordForm) => {
    await checkUserPasswordMutation.mutateAsync(formData);
    await deleteProjectMutation.mutateAsync(deleteProjectId);
  };

  return (
    <Transition appear show={show} as={Fragment}>
      <Dialog
        as="div"
        className="relative z-10"
        onClose={() => navigate(location.pathname, { replace: true })}
      >
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/60" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-4xl transform overflow-hidden rounded-2xl bg-white text-left align-middle shadow-xl transition-all p-16">
                <Dialog.Title as="h3" className="font-black text-4xl  my-5">
                  Eliminar Proyecto{" "}
                </Dialog.Title>

                <p className="text-xl font-bold">
                  Confirma la eliminación del proyecto {""}
                  <span className="text-fuchsia-600">
                    colocando tu password
                  </span>
                </p>

                <form
                  className="mt-10 space-y-5"
                  onSubmit={handleSubmit(handleForm)}
                  noValidate
                >
                  <div className="flex flex-col gap-3">
                    <label className="font-normal text-2xl" htmlFor="password">
                      Password
                    </label>
                    <input
                      id="password"
                      type="password"
                      placeholder="Password Inicio de Sesión"
                      className="w-full p-3  border-gray-300 border"
                      {...register("password", {
                        required: "El password es obligatorio",
                      })}
                    />
                    {errors.password && (
                      <ErrorMessage>{errors.password.message}</ErrorMessage>
                    )}
                  </div>

                  <input
                    type="submit"
                    className=" bg-fuchsia-600 hover:bg-fuchsia-700 w-full p-3  text-white font-black  text-xl cursor-pointer"
                    value="Eliminar Proyecto"
                  />
                </form>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}
