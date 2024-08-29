import { Link, Navigate, useNavigate, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getFullProject } from "@/api/ProjectAPI";
import AddTaskModal from "@/components/tasks/AddTaskModal";
import TaskList from "@/components/tasks/TaskList";
import EditTaskData from "@/components/tasks/EditTaskData";
import TaskModalDetails from "@/components/tasks/TaskModalDetails";
import { useAuth } from "@/hooks/useAuth";
import { isManager } from "@/utils/policies";
import { useMemo } from "react";

export default function ProjectDetailsView() {
  const { data: user, isLoading: authLoading } = useAuth();
  const navigate = useNavigate(); // Hook para la navegación programática

  const params = useParams(); // Hook para obtener parámetros de la URL
  const projectId = params.projectId!; // Obtiene el ID del proyecto de los parámetros (se asume que siempre está presente)

  // Configuración del hook useQuery para obtener los datos del proyecto
  const { data, isLoading, isError } = useQuery({
    queryKey: ["project", projectId], // Clave única para la consulta
    queryFn: () => getFullProject(projectId), // Función para obtener los datos del proyecto
    retry: false, // Desactiva los reintentos automáticos en caso de error
  });

  const canEdit = useMemo(() => data?.manager === user?._id, [data, user]);

  // Renderiza un mensaje de carga mientras los datos se están recuperando
  if (isLoading && authLoading) return "Cargando...";

  // Si ocurre un error, redirige a la página de error 404
  if (isError) return <Navigate to="/404" />;

  // Una vez que los datos están disponibles, renderiza los detalles del proyecto y la lista de tareas
  if (data && user)
    return (
      <>
        <h1 className="text-5xl font-black">{data.projectName}</h1>
        <p className="text-2xl font-light text-gray-500 mt-5">
          {data.description}
        </p>

        {isManager(data.manager, user._id) && (
          <nav className="my-5 flex gap-3">
            <button
              type="button"
              className="bg-purple-400 hover:bg-purple-500 px-10 py-3 text-white text-xl font-bold cursor-pointer transition-colors"
              onClick={() => navigate(location.pathname + "?newTask=true")}
            >
              Agregar Tarea
            </button>
            <Link
              to={"team"}
              className="bg-fuchsia-600 hover:bg-fuchsia-700 px-10 py-3 text-white text-xl font-bold cursor-pointer transition-colors"
            >
              Colaboradores
            </Link>
          </nav>
        )}

        <TaskList tasks={data.tasks} canEdit={canEdit} />
        <AddTaskModal />
        <EditTaskData />
        <TaskModalDetails />
      </>
    );
}
