import api from "@/lib/axios";
import { isAxiosError } from "axios";
import { Project, TeamMember, TeamMemberForm, teamMembersSchema } from "../types";

//Busca un usuario por su email dentro del proyecto
export async function findUserByEmail({
  projectId,
  formData,
}: {
  projectId: Project["_id"];
  formData: TeamMemberForm;
}) {
  try {
    const url = `/projects/${projectId}/team/find`;
    const { data } = await api.post(url, formData);

    return data;
  } catch (error) {
    if (isAxiosError(error) && error.response) {
      throw new Error(error.response.data.error);
    }
  }
}

//Añadir usuario a un proyecto
export async function addUserToProject({
  projectId,
  id,
}: {
  projectId: Project["_id"];
  id: TeamMember["_id"];
}) {
  try {
    const url = `/projects/${projectId}/team`;
    const { data } = await api.post<string>(url, { id });

    return data;
  } catch (error) {
    if (isAxiosError(error) && error.response) {
      throw new Error(error.response.data.error);
    }
  }
}

//Obtiene los miembros del equipo de un proyecto
export async function getProjectTeam(projectId: Project["_id"]) {
  try {
    const url = `/projects/${projectId}/team`;
    const { data } = await api(url);
    const response = teamMembersSchema.safeParse(data)
    if(response.success){
        return response.data
    }
  } catch (error) {
    if (isAxiosError(error) && error.response) {
      throw new Error(error.response.data.error);
    }
  }
}

// Elimina un usuario de un proyecto
export async function removeUserFromProject({
    projectId,
    userId,
  }: {
    projectId: Project["_id"];
    userId: TeamMember["_id"];
  }) {
    try {
      const url = `/projects/${projectId}/team/${userId}`;
      const { data } = await api.delete<string>(url);
  
      return data;
    } catch (error) {
      if (isAxiosError(error) && error.response) {
        throw new Error(error.response.data.error);
      }
    }
  }