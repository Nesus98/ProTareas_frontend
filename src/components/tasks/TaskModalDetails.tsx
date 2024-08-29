import { Fragment } from "react";
import { Dialog, Transition } from "@headlessui/react";
import {
  Navigate,
  useLocation,
  useNavigate,
  useParams,
} from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getTaskById, updateStatus } from "@/api/TaskAPI";
import { toast } from "react-toastify";
import { formatDate } from "@/utils/utils";
import { statusTranslations } from "@/locales/es";
import { TaskStatus } from "@/types/index";

export default function TaskModalDetails() {
  // Hook para acceder a los parámetros de la URL en la aplicación React
  const params = useParams();

  // Obtiene el ID del proyecto desde los parámetros de la URL
  const projectId = params.projectId!;

  // Hook para la navegación en la aplicación React
  const navigate = useNavigate();

  // Hook para acceder a la ubicación actual de la página
  const location = useLocation();

  // Extrae los parámetros de la consulta de la URL
  const queryParams = new URLSearchParams(location.search);

  // Obtiene el ID de la tarea desde los parámetros de la consulta
  const taskId = queryParams.get("viewTask")!;

  // Determina si se debe mostrar la vista de la tarea basado en la presencia del taskId
  const show = taskId ? true : false;

  // Hook para realizar consultas de datos usando React Query
  const { data, isError, error } = useQuery({
    queryKey: ["task", taskId],

    queryFn: () => getTaskById({ projectId, taskId }),

    enabled: !!taskId,

    retry: false,
  });

  // Hook para interactuar con el caché de consultas de React Query
  const queryClient = useQueryClient();

  // Función para manejar cambios en un elemento <select>
  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const status = e.target.value as TaskStatus;

    const data = { projectId, taskId, status };

    // Llama a la función mutate para actualizar el estado
    mutate(data);
  };

  // Configuración del hook useMutation para actualizar el estado de la tarea
  const { mutate } = useMutation({
    mutationFn: updateStatus,

    onError: (error) => {
      toast.error(error.message);
    },
    onSuccess: (data) => {
      toast.success(data);

      // Invalida el caché de consultas para el proyecto y la tarea para actualizar los datos
      queryClient.invalidateQueries({ queryKey: ["project", projectId] });
      queryClient.invalidateQueries({ queryKey: ["task", taskId] });
    },
  });

  // Maneja los errores de la consulta y redirige si ocurre un error
  if (isError) {
    toast.error(error.message, { toastId: "error" });
    return <Navigate to={`/projects/${projectId}`} />;
  }

  //Si data = true entonces mostrara el contenido
  if (data)
    return (
      <>
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
                    <p className="text-sm text-slate-400">
                      Agregada el: {formatDate(data.createdAt)}
                    </p>
                    <p className="text-sm text-slate-400">
                      Última actualización: {formatDate(data.updatedAt)}
                    </p>
                    <Dialog.Title
                      as="h3"
                      className="font-black text-4xl text-slatse-600 my-5"
                    >
                      {data.name}
                    </Dialog.Title>
                    <p className="text-lg text-slate-500 mb-2">
                      Descripción: {data.description}
                    </p>
                    <p className="text-2xl text-slate-500 mb-2">
                      Historial de cambios
                    </p>
                    <ul className="list-decimal">
                      {data.completedBy.map((activityLog) => (
                        <li key={activityLog._id}>
                          <span className="font-bold text-slate-600">
                            {statusTranslations[activityLog.status]}
                          </span>{" "}
                          por: {activityLog.user.name}
                        </li>
                      ))}
                    </ul>

                    <div className="my-5 space-y-3">
                      <label className="font-bold">Estado Actual: </label>
                      <select
                        name=""
                        id=""
                        className="w-full p-3 bg-white border border-gray-300"
                        defaultValue={data.status}
                        onChange={handleChange}
                      >
                        {Object.entries(statusTranslations).map(
                          ([key, value]) => (
                            <option key={key} value={key}>
                              {value}
                            </option>
                          )
                        )}
                      </select>
                    </div>
                  </Dialog.Panel>
                </Transition.Child>
              </div>
            </div>
          </Dialog>
        </Transition>
      </>
    );
}
