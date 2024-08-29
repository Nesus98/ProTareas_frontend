// Importar los tipos y módulos necesarios
import {
  Project,
  ProjectFormData,
  dashboardProjectSchema,
  editProjectSchema,
  projectSchema,
} from "@/types/index";
import api from "@/lib/axios";
import { isAxiosError } from "axios";

// Función para crear un nuevo proyecto
export async function createProject(formData: ProjectFormData) {
  try {
    // Enviar una solicitud POST para crear un nuevo proyecto
    const { data } = await api.post("/projects", formData);
    return data;
  } catch (error) {
    // Manejar errores de Axios específicamente
    if (isAxiosError(error) && error.response) {
      // Lanzar un error con el mensaje de error de la respuesta
      throw new Error(error.response.data.error);
    }
  }
}

// Función para obtener todos los proyectos
export async function getProjects() {
  
  try {
    // Enviar una solicitud GET para obtener todos los proyectos
    const { data } = await api("/projects");
    // Validar los datos de la respuesta usando dashboardProjectSchema
    const response = dashboardProjectSchema.safeParse(data);

    // Si la validación es exitosa, devolver los datos
    if (response.success) {
      return response.data;
    }
  } catch (error) {
    // Manejar errores de Axios específicamente
    if (isAxiosError(error) && error.response) {
      // Lanzar un error con el mensaje de error de la respuesta
      throw new Error(error.response.data.error);
    }
  }
}

// Función para obtener un proyecto por su ID
export async function getProjectById(id: Project["_id"]) {
  try {
    // Enviar una solicitud GET para obtener un proyecto por su ID
    const { data } = await api(`/projects/${id}`);
    const response = editProjectSchema.safeParse(data)
    if(response.success){
      return response.data
    }
  } catch (error) {
    // Manejar errores de Axios específicamente
    if (isAxiosError(error) && error.response) {
      // Lanzar un error con el mensaje de error de la respuesta
      throw new Error(error.response.data.error);
    }
  }
}

export async function getFullProject(id: Project["_id"]) {
  try {
    // Enviar una solicitud GET para obtener un proyecto por su ID
    const { data } = await api(`/projects/${id}`);
    const response = projectSchema.safeParse(data)
    if(response.success){
      return response.data
    }
  } catch (error) {
    // Manejar errores de Axios específicamente
    if (isAxiosError(error) && error.response) {
      // Lanzar un error con el mensaje de error de la respuesta
      throw new Error(error.response.data.error);
    }
  }
}

// Definir un tipo para los parámetros de la función updateProject
type ProjectAPIType = {
  formData: ProjectFormData;
  projectId: Project["_id"];
};

// Función para actualizar un proyecto existente
export async function updateProject({ formData, projectId }: ProjectAPIType) {
  try {
    // Enviar una solicitud PUT para actualizar el proyecto con el ID dado
    const { data } = await api.put<string>(`/projects/${projectId}`, formData);
    return data;
  } catch (error) {
    // Manejar errores de Axios específicamente
    if (isAxiosError(error) && error.response) {
      // Lanzar un error con el mensaje de error de la respuesta
      throw new Error(error.response.data.error);
    }
  }
}

// Función para eliminar un proyecto por su ID
export async function deleteProject(id: Project["_id"]) {
  try {
    // Construir la URL para la solicitud DELETE
    const url = `/projects/${id}`;
    // Enviar una solicitud DELETE para eliminar el proyecto
    const { data } = await api.delete<string>(url);
    return data;
  } catch (error) {
    // Manejar errores de Axios específicamente
    if (isAxiosError(error) && error.response) {
      // Lanzar un error con el mensaje de error de la respuesta
      throw new Error(error.response.data.error);
    }
  }
}
