import { z } from "zod";
const today = new Date();
today.setHours(0, 0, 0, 0);

const Options = z.object({ value: z.string(), label: z.string() });
export const projectSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  taskStatus: z.array(Options).min(1, "At least one task status is required"),
  collaborators: z.array(Options).optional(),
});
export type ProjectFormValues = z.infer<typeof projectSchema>;

export const taskSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  taskPriority: z.union([
    Options,
    z.string().min(1, "Please select a task priority"),
  ]),
  project: z.union([Options, z.string().min(1, "Please select a project")]),
  dueDate: z.union([
    z.string().min(1, { message: "Please select todays or future date" }),
    z.date().min(today, { message: "Please select todays or future date" }),
  ]),
  status: z.string().min(1, "Task status is required"),
  collaborators: z.array(Options).optional(),
  files: z.any().optional(),
});

export type TaskFormValues = z.infer<typeof taskSchema>;
export const backlogSchema = z.object({
  collaborators: z.array(Options).optional(),
});

export type BackFormValues = z.infer<typeof backlogSchema>;
