import axios, { AxiosResponse } from "axios";
import BASE_URL from "@/constants/BASE_URL";
import { projectRoutes, taskRoutes, userRoutes } from "@/constants/apiRoutes";
import { ProjectData, TaskPayload, UserData } from "@/constants/interface";
// Type for the status object

//User api's
export const saveUserData = async (
  data: UserData
): Promise<AxiosResponse<any, any>> => {
  return await axios.post(`${BASE_URL}${userRoutes.syncUser}`, data);
};
export const getUsers = async (): Promise<AxiosResponse<any, any>> => {
  return await axios.get(`${BASE_URL}${userRoutes.getUser}`);
};

//Project api's
export const createProject = async (
  data: ProjectData,
  token: string
): Promise<AxiosResponse<any, any>> => {
  return await axios.post(`${BASE_URL}${projectRoutes.createProject}`, data, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });
};
export const editProject = async (
  data: ProjectData | FormData,
  id: string,
  token: string
): Promise<AxiosResponse<any, any>> => {
  return await axios.put(
    `${BASE_URL}${projectRoutes.editProject}/${id}`,
    data,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    }
  );
};
export const getProject = async (
  token: string
): Promise<AxiosResponse<any, any>> => {
  return await axios.get(`${BASE_URL}${projectRoutes.getProject}`, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });
};
export const getProjectById = async (
  id: string,
  token: string
): Promise<AxiosResponse<any, any>> => {
  return await axios.get(`${BASE_URL}${projectRoutes.getProjectById}/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });
};
export const removeProject = async (
  id: string,
  token: string
): Promise<AxiosResponse<any, any>> => {
  return await axios.delete(`${BASE_URL}${projectRoutes.deleteProject}/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });
};

// Task api's
export const createTask = async (
  data: TaskPayload,
  token: string
): Promise<AxiosResponse<any, any>> => {
  return await axios.post(`${BASE_URL}${taskRoutes.createTask}`, data, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "multipart/form-data",
    },
  });
};
export const askAi = async (
  taskTitle: string,
  token: string
): Promise<AxiosResponse<any, any>> => {
  return await axios.post(
    `${BASE_URL}${taskRoutes.askAi}`,
    { taskTitle },
    {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    }
  );
};
export const getTask = async (
  token: string
): Promise<AxiosResponse<any, any>> => {
  return await axios.get(`${BASE_URL}${taskRoutes.getTask}`, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });
};
export const removeTask = async (
  id: string,
  token: string
): Promise<AxiosResponse<any, any>> => {
  return await axios.delete(`${BASE_URL}${taskRoutes.deleteTask}/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });
};
export const getTaskById = async (
  id: string,
  token: string
): Promise<AxiosResponse<any, any>> => {
  return await axios.get(`${BASE_URL}${taskRoutes.getTaskById}/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });
};
export const editTask = async (
  data: Partial<TaskPayload> | FormData,
  id: string,
  token: string
): Promise<AxiosResponse<any, any>> => {
  return await axios.put(`${BASE_URL}${taskRoutes.editTask}/${id}`, data, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};
export const getUnassignedTasks = async (
  token: string
): Promise<AxiosResponse<any, any>> => {
  return await axios.get(`${BASE_URL}${taskRoutes.getUnassignedTasks}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};
export const getTasksByProjectId = async (
  token: string,
  id: string,
): Promise<AxiosResponse<any, any>> => {
  return await axios.get(`${BASE_URL}${taskRoutes.getProjectTasks}/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};
