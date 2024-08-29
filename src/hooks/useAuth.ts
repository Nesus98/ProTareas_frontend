import { getUser } from "@/api/AuthAPI";
import { useQuery } from "@tanstack/react-query";

//Hook personalizado
export const useAuth = () => {
  // Configura y ejecuta una consulta con useQuery para obtener los datos del usuario
  const { data, isError, isLoading } = useQuery({
    // La clave de la consulta que identifica esta consulta específica en el caché
    queryKey: ["user"],
    // La función que realiza la consulta y obtiene los datos del usuario
    queryFn: getUser,
    // Número de intentos de reintento en caso de error (1 significa un solo intento)
    retry: 1,
    // Indica si se debe volver a realizar la consulta cuando la ventana de la aplicación recibe foco
    refetchOnWindowFocus: false,
  });

  return { data, isError, isLoading };
};
