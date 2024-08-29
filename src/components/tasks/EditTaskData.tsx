import { Navigate, useLocation, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getTaskById } from "@/api/TaskAPI";
import EditTaskModal from "./EditTaskModal";

export default function EditTaskData() {
  // Obtiene los parámetros de la URL
  const params = useParams();

  // Asegura que projectId está definido y no es nulo
  const projectId = params.projectId!;

  // Obtiene la ubicación actual de la ruta, útil para manejar parámetros de consulta
  const location = useLocation();

  // Extrae los parámetros de consulta de la URL, en este caso, el taskId
  const queryParams = new URLSearchParams(location.search);

  // Asegura que taskId está definido y no es nulo
  const taskId = queryParams.get("editTask")!;

  // Utiliza el hook useQuery de React Query para obtener los datos de la tarea
  const { data, isError } = useQuery({
    queryKey: ["task", taskId],
    queryFn: () => getTaskById({ projectId, taskId }),
    enabled: !!taskId,
  });

  // Si ocurre un error durante la consulta, redirige a una página de error 404
  if (isError) return <Navigate to={"/404"} />;

  // Si los datos se obtienen correctamente, muestra el componente EditTaskModal
  if (data) return <EditTaskModal data={data} taskId={taskId} />;
}
