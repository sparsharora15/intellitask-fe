export interface UserData {
  fullName: string;
  userId: string;
  phoneNo: string;
  email: string;
}
export interface Options {
  value: string;
  label: string;
}

export interface ProjectData {
  title: string;
  description: string;
  status: string[];
  users?: string[];
}
export interface User {
  tasks: any[];
  _id: string;
  fullName: string;
  email: string;
  userId: string;
  taskId: any[];
  __v: number;
}
export interface Project {
  _id: string;
  title: string;
  description: string;
  users: string[];
  status: string[];
  createdBy: string;
  __v: number;
}

export interface TaskPayload {
  taskName: string;
  description?: string;
  attachments?:File[]
  status?: string;
  users: string[];
  priority: string;
  dueDate?: Date;
  projectId: string;
  deletedAttachments?: any[];
  assignedTo:string
}
