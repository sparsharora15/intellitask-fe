import { Options } from "@/constants/interface";
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
export const getFieldWithOptions = (
  field: any,
  userData: Options[] = [],
  projectStatuses: Options[] = [],
  projectsOptions: Options[] = []
) => {
  if (field.id === "collaborators") {
    return { ...field, options: userData };
  } else if (field.id === "status") {
    return { ...field, radioOptions: projectStatuses };
  } else if (field.id === "project") {
    return { ...field, options: projectsOptions };
  }
  return field;
};
