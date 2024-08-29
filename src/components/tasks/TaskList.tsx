import { DndContext, DragEndEvent } from "@dnd-kit/core";
import { Project, TaskProject, TaskStatus } from "@/types/index";
import TaskCard from "./TaskCard";
import { statusTranslations } from "@/locales/es";
import DropTask from "./DropTask";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateStatus } from "@/api/TaskAPI";
import { toast } from "react-toastify";
import { useParams } from "react-router-dom";

// Definir los tipos de propiedades que el componente TaskList acepta
type TaskListProps = {
  tasks: TaskProject[];
  canEdit: boolean;
};

// Definir un tipo para agrupar las tareas por estado
type GroupedTasks = {
  [key: string]: TaskProject[];
};

// Estado inicial de los grupos de tareas, todos vacíos
const initialStatusGroups: GroupedTasks = {
  pending: [],
  onHold: [],
  inProgress: [],
  underReview: [],
  completed: [],
};

// Estilos de borde superior para cada estado de las tareas
const statusStyles: { [key: string]: string } = {
  pending: "border-t-slate-500",
  onHold: "border-t-red-500",
  inProgress: "border-t-blue-500",
  underReview: "border-t-amber-500",
  completed: "border-t-emerald-500",
};

// Componente funcional TaskList que recibe la lista de tareas como propiedad
export default function TaskList({ tasks, canEdit }: TaskListProps) {
  
  // Hook para acceder a los parámetros de la URL en la aplicación React
  const params = useParams();

  // Obtiene el ID del proyecto desde los parámetros de la URL
  const projectId = params.projectId!;

  // Hook para interactuar con el caché de consultas de React Query
  const queryClient = useQueryClient();

  // Configuración del hook useMutation para actualizar el estado
  const { mutate } = useMutation({
    // Función que realiza la mutación para actualizar el estado
    mutationFn: updateStatus,

    onError: (error) => {
      toast.error(error.message);
    },
    onSuccess: (data) => {
      toast.success(data);
      queryClient.invalidateQueries({ queryKey: ["project", projectId] });
    },
  });

  // Agrupar las tareas por estado usando reduce
  const groupedTasks = tasks.reduce((acc, task) => {
    // Obtener el grupo actual de tareas según su estado, si no existe, crear un grupo vacío
    let currentGroup = acc[task.status] ? [...acc[task.status]] : [];
    // Agregar la tarea actual al grupo correspondiente
    currentGroup = [...currentGroup, task];
    // Devolver el acumulador con el grupo actualizado
    return { ...acc, [task.status]: currentGroup };
  }, initialStatusGroups);

  const handleDragEnd = (e: DragEndEvent) => {
    const { over, active } = e;
    if (over && over.id) {
      const taskId = active.id.toString();
      const status = over.id as TaskStatus;

      mutate({ projectId, taskId, status });

      queryClient.setQueryData(["project", projectId], (prevData: Project) => {
        const updatedTasks = prevData.tasks.map((task) => {
          if (task._id === taskId) {
            return {
              ...task,
              status,
            };
          }
          return task;
        });
        return {
          ...prevData,
          tasks: updatedTasks,
        };
      });
    }
  };

  return (
    <>
      {/* Título de la lista de tareas */}
      <h2 className="text-5xl font-black my-10">Tareas</h2>

      {/* Contenedor para los grupos de tareas, con desplazamiento horizontal */}
      <div className="flex gap-5 overflow-x-scroll 2xl:overflow-auto pb-32">
        <DndContext onDragEnd={handleDragEnd}>
          {Object.entries(groupedTasks).map(([status, tasks]) => (
            <div key={status} className="min-w-[300px] 2xl:min-w-0 2xl:w-1/5">
              {/* Título del grupo de tareas con estilo según su estado */}
              <h3
                className={`capitalize text-xl font-light border border-slate-300 bg-white p-3 border-t-8 ${statusStyles[status]}`}
              >
                {statusTranslations[status]}
              </h3>
              <DropTask status={status} />

              {/* Lista de tareas en el grupo */}
              <ul className="mt-5 space-y-5">
                {tasks.length === 0 ? (
                  <li className="text-gray-500 text-center pt-3">
                    No Hay tareas
                  </li>
                ) : (
                  tasks.map((task) => (
                    <TaskCard key={task._id} task={task} canEdit={canEdit} />
                  ))
                )}
              </ul>
            </div>
          ))}
        </DndContext>
      </div>
    </>
  );
}
