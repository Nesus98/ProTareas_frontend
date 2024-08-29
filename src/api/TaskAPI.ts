// Importar el cliente Axios configurado y la función para verificar errores de Axios
import api from "@/lib/axios";
import { isAxiosError } from "axios";

// Importar los tipos necesarios
import { Project, Task, TaskFormData, taskSchema } from "../types";

// Definir un tipo para los parámetros de la API de tareas
type TaskAPI = {
  formData: TaskFormData;
  projectId: Project["_id"];
  taskId: Task["_id"];
  status: Task["status"];
};

// Función asíncrona para crear una nueva tarea
export async function createTask({
  formData,
  projectId,
}: Pick<TaskAPI, "formData" | "projectId">) {
  try {
    // Construir la URL para la solicitud POST, incluyendo el ID del proyecto
    const url = `/projects/${projectId}/tasks`;
    // Enviar una solicitud POST para crear una nueva tarea
    const { data } = await api.post<string>(url, formData);
    return data; // Devolver los datos de la respuesta
  } catch (error) {
    // Verificar si el error es de tipo Axios y si tiene una respuesta asociada
    if (isAxiosError(error) && error.response) {
      // Lanzar un error con el mensaje de error de la respuesta
      throw new Error(error.response.data.error);
    }
  }
}

//Obtiene tareas por su id
export async function getTaskById({
  projectId,
  taskId,
}: Pick<TaskAPI, "projectId" | "taskId">) {
  try {
    const url = `/projects/${projectId}/tasks/${taskId}`;
    const { data } = await api(url);
    const response = taskSchema.safeParse(data);
    console.log(response);
    if (response.success) {
      return response.data;
    }
  } catch (error) {
    if (isAxiosError(error) && error.response) {
      // Lanzar un error con el mensaje de error de la respuesta
      throw new Error(error.response.data.error);
    }
  }
}

//Actualiza una tarea
export async function updateTask({
  projectId,
  taskId,
  formData,
}: Pick<TaskAPI, "projectId" | "taskId" | "formData">) {
  try {
    const url = `/projects/${projectId}/tasks/${taskId}`;
    const { data } = await api.put<string>(url, formData);
    return data;
  } catch (error) {
    if (isAxiosError(error) && error.response) {
      // Lanzar un error con el mensaje de error de la respuesta
      throw new Error(error.response.data.error);
    }
  }
}

//Eliminar una tarea
export async function deleteTask({
  projectId,
  taskId,
}: Pick<TaskAPI, "projectId" | "taskId">) {
  try {
    const url = `/projects/${projectId}/tasks/${taskId}`;
    const { data } = await api.delete<string>(url);
    return data;
  } catch (error) {
    if (isAxiosError(error) && error.response) {
      // Lanzar un error con el mensaje de error de la respuesta
      throw new Error(error.response.data.error);
    }
  }
}

//Actualiza el estado de una tarea
export async function updateStatus({
  projectId,
  taskId,
  status,
}: Pick<TaskAPI, "projectId" | "taskId" | "status">) {
  try {
    const url = `/projects/${projectId}/tasks/${taskId}/status`;
    const { data } = await api.post<string>(url, { status });
    return data;
  } catch (error) {
    if (isAxiosError(error) && error.response) {
      // Lanzar un error con el mensaje de error de la respuesta
      throw new Error(error.response.data.error);
    }
  }
}
