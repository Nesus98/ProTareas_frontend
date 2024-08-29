import { Navigate, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getProjectById } from "@/api/ProjectAPI";
import EditProjectForm from "./EditProjectForm";

export default function EditProjectView() {
  const params = useParams(); // Obtiene los parámetros de la URL
  const projectId = params.projectId!; // Obtiene el ID del proyecto de los parámetros (se asume que siempre está presente)

  // Configuración del hook useQuery para obtener los datos del proyecto
  const { data, isLoading, isError } = useQuery({
    queryKey: ["editProject", projectId], // Clave única para la consulta
    queryFn: () => getProjectById(projectId), // Función que obtiene los datos del proyecto
    retry: false, // Desactiva los reintentos automáticos en caso de error
  });

  // Renderiza un mensaje de carga mientras los datos se están recuperando
  if (isLoading) return "Cargando...";

  // Si ocurre un error, redirige a la página de error 404
  if (isError) return <Navigate to="/404" />;

  // Una vez que los datos están disponibles, renderiza el formulario de edición
  if (data) return <EditProjectForm data={data} projectId={projectId} />;
}
