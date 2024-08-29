import { TaskProject } from "@/types/index";
import { Menu, Transition } from "@headlessui/react";
import { EllipsisVerticalIcon } from "@heroicons/react/20/solid";
import { Fragment } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteTask } from "@/api/TaskAPI";
import { toast } from "react-toastify";
import { useDraggable } from "@dnd-kit/core";

// Definir los tipos de propiedades que el componente TaskCard acepta
type TaskCardProps = {
  task: TaskProject;
  canEdit: boolean;
};

// Componente funcional TaskCard que recibe una tarea como propiedad
export default function TaskCard({ task, canEdit }: TaskCardProps) {

  //hook para el drag and drop
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: task._id,
  });

  //Hook para reedireccionar
  const navigate = useNavigate();

  // Hook para acceder a los parámetros de la URL
  const params = useParams();

  // ID del proyecto extraído de los parámetros de la URL
  const projectId = params.projectId!;

   // Hook para interactuar con el caché y las consultas de React Query
  const queryClient = useQueryClient();

  //Hook para la eliminacion de la tarea
  const { mutate } = useMutation({
    mutationFn: deleteTask,
    onError: (error) => {
      toast.error(error.message);
    },
    onSuccess: (data) => {
      toast.success(data);
      queryClient.invalidateQueries({ queryKey: ["project", projectId] });
    },
  });

  // Estilo aplicado a la tarea cuando está siendo arrastrada
  const style = transform
    ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
        padding: "1.25rem",
        backgroundColor: "#FFF",
        width: "300px",
        display: "flex",
        borderWidth: "1px",
        borderColor: "rgb(203 213 225 / var(--tw-border-opacity))",
      }
    : undefined;

  return (
    // List item que contiene el contenido de la tarjeta de tarea
    <li className="p-5 bg-white border border-slate-300 flex justify-between gap-3">
      <div
        {...listeners}
        {...attributes}
        ref={setNodeRef}
        style={style}
        className="min-w-0 flex flex-col gap-y-4"
      >
        {/* Botón que muestra el nombre de la tarea */}
        <p className="text-xl font-bold text-slate-600 text-left">
          {task.name}
        </p>
        {/* Párrafo que muestra la descripción de la tarea */}
        <p className="text-slate-500">{task.description}</p>
      </div>
      <div className="flex shrink-0 gap-x-6">
        {/* Menú desplegable para opciones adicionales */}
        <Menu as="div" className="relative flex-none">
          {/* Botón del menú con el ícono de tres puntos */}
          <Menu.Button className="-m-2.5 block p-2.5 text-gray-500 hover:text-gray-900">
            <span className="sr-only">opciones</span>
            <EllipsisVerticalIcon className="h-9 w-9" aria-hidden="true" />
          </Menu.Button>
          {/* Transición para el menú desplegable */}
          <Transition
            as={Fragment}
            enter="transition ease-out duration-100"
            enterFrom="transform opacity-0 scale-95"
            enterTo="transform opacity-100 scale-100"
            leave="transition ease-in duration-75"
            leaveFrom="transform opacity-100 scale-100"
            leaveTo="transform opacity-0 scale-95"
          >
            {/* Items del menú que se muestran al desplegarse */}
            <Menu.Items className="absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-white py-2 shadow-lg ring-1 ring-gray-900/5 focus:outline-none">
              {/* Item del menú para ver la tarea */}
              <Menu.Item>
                <button
                  type="button"
                  className="block px-3 py-1 text-sm leading-6 text-gray-900"
                  onClick={() =>
                    navigate(location.pathname + `?viewTask=${task._id}`)
                  }
                >
                  Ver Tarea
                </button>
              </Menu.Item>
              {/* Item del menú para editar la tarea */}
              {canEdit && (
                <>
                  <Menu.Item>
                    <button
                      type="button"
                      className="block px-3 py-1 text-sm leading-6 text-gray-900"
                      onClick={() =>
                        navigate(location.pathname + `?editTask=${task._id}`)
                      }
                    >
                      Editar Tarea
                    </button>
                  </Menu.Item>
                  {/* Item del menú para eliminar la tarea */}
                  <Menu.Item>
                    <button
                      type="button"
                      className="block px-3 py-1 text-sm leading-6 text-red-500"
                      onClick={() => mutate({ projectId, taskId: task._id })}
                    >
                      Eliminar Tarea
                    </button>
                  </Menu.Item>
                </>
              )}
            </Menu.Items>
          </Transition>
        </Menu>
      </div>
    </li>
  );
}
