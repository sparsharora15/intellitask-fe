import { ColumnDef } from "@tanstack/react-table";
import {
  LayoutDashboard,
  FolderGit2,
  CalendarCheck2,
  Trello,
} from "lucide-react";
import { pageRoutes } from "./pageRoutes";
import { User } from "@/constants/interface";

export const routes = [
  // {
  //   label: "Dashboard",
  //   icon: LayoutDashboard,
  //   href: `${pageRoutes.INTELLITASKS}/${pageRoutes.DASHBOARD}`,
  //   color: "text-sky-500",
  // },
  {
    label: "Board",
    icon: Trello,
    href: `${pageRoutes.INTELLITASKS}/${pageRoutes.BOARD}`,
    color: "text-teal-500",
  },
  {
    label: "Projects",
    icon: FolderGit2,
    href: `${pageRoutes.INTELLITASKS}/${pageRoutes.PROJECTS}`,
    color: "text-violet-500",
  },
  {
    label: "Tasks",
    icon: CalendarCheck2,
    href: `${pageRoutes.INTELLITASKS}/${pageRoutes.TASKS}`,
    color: "text-emerald-500",
  },
  {
    label: "Backlog",
    icon: FolderGit2,
    href: `${pageRoutes.INTELLITASKS}/${pageRoutes.BACKLOG}`,
    color: "text-orange-600",
  },
  // {
  //   label: "Logout",
  //   icon: LogOut,
  //   href: "/",
  //   color: "text-white-600",
  // },
];

export type Project = {
  title: any;
  projectName: string;
  projectDescription: string;
  totalUser: number;
  createdAt: Date | string;
  createdBy: User;
  totalTask: number;
  _id: string;
};
export type Tasks = {
  _id: string;
  title: string;
  description: string;
  dueDate: string | Date;
  createdAt: string | Date;
  createdBy: User;
  priority: string;
  status: string;
  taskName: string;
};

export const columns: ColumnDef<Project>[] = [
  {
    accessorKey: "projectName",
    header: "Project Name",
  },
  {
    accessorKey: "projectDescription",
    header: "Project Description",
  },
  {
    accessorKey: "totalUser",
    header: "Total User",
  },
  {
    accessorKey: "totalTask",
    header: "Total Task",
  },
];

export const valuesListHomepage = [
  "New",
  "Reliable ",
  "Smarter",
  "Optimal",
  "Adaptable ",
];
export const projectDialogInputFields = [
  {
    id: "title",
    label: "Title",
    type: "text",
    placeholder: "Enter project title",
  },
  {
    id: "description",
    label: "Description",
    type: "text",
    isRichText: true,
    placeholder: "Enter project description",
  },
  {
    id: "askAiButton",
    label: "",
    type: "askAiButton",
    isRichText: false,
    placeholder: "Ask Ai",
  },
  {
    id: "taskStatus",
    label: "Task statuses",
    type: "creatable-select",
    isMulti: true,
    isClearable: true,
    options: [
      { value: "pending", label: "Pending" },
      { value: "In progress", label: "In Progress" },
      { value: "completed", label: "Completed" },
    ],
    placeholder: "Create or select statuses",
  },
  {
    id: "collaborators",
    label: "Collaborators",
    type: "select",
    isClearable: true,
    isMulti: true,
    options: [],
    placeholder: "Select collaborators",
  },
];
export const taskDialogInputFields = [
  {
    id: "title",
    label: "Title",
    type: "text",
    placeholder: "Enter project title",
  },
  {
    id: "description",
    label: "Description",
    type: null,
    isRichText: true,
    placeholder: "Enter task description",
  },
  {
    id: "askAiButton",
    label: "",
    type: "askAiButton",
    isRichText: false,
    placeholder: "Ask Ai",
  },
  {
    id: "taskPriority",
    label: "Task Priority",
    type: "select",
    isClearable: false,
    options: [
      { value: "high", label: "High" },
      { value: "medium", label: "Medium" },
      { value: "low", label: "Low" },
    ],
    placeholder: "Select Priority",
  },
  {
    id: "dueDate",
    label: "Due Date",
    type: "date",
    placeholder: "Select due date",
  },
  {
    id: "status",
    label: "Task status",
    type: "radio",
    radioOptions: [],
    placeholder: "Select Task Priority",
  },
  {
    id: "collaborators",
    label: "Collaborators",
    type: "select",
    isClearable: true,
    isMulti: true,
    options: [],
    placeholder: "Select collaborators",
  },
  {
    id: "project",
    label: "Project",
    type: "select",
    isClearable: true,
    isMulti: false,
    options: [],
    placeholder: "Select project",
  },
  {
    id: "files",
    label: "Attachments",
    type: null,
    isFileUploader: true,
  },
];
export const backlogDialogInputFields = [
  {
    id: "collaborators",
    label: "Collaborators",
    type: "select",
    isClearable: true,
    isMulti: true,
    options: [],
    placeholder: "Select collaborators",
  },
];
export function removeHtml(str: string): string {
  return str.replace(/<\/?[^>]+>/gi, "");
}
