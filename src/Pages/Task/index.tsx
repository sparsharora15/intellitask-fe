import ConfirmPopup from "@/components/common/ConfirmPopup";
import { DataTable } from "@/components/common/DataTable";
import Searchbar from "@/components/common/Searchbar";
import InputDialog from "@/components/DialogBoxes/InputDialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { Options, Project, User } from "@/constants/interface";
import { taskDialogInputFields, Tasks } from "@/lib/data";
import { TaskFormValues, taskSchema } from "@/lib/schema/Schemas";
import { getFieldWithOptions } from "@/lib/utils";

import Loader from "@/components/common/Loader";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  askAi,
  createTask,
  editTask,
  getProject,
  getTask,
  getTaskById,
  getUsers,

  removeTask,
} from "@/services/api";
import { useAuth } from "@clerk/clerk-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import { MoreHorizontal } from "lucide-react";
import { useEffect, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";

const Task = () => {
  const { toast } = useToast();
  const [aiLoading, setAiLoading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [, setProjects] = useState<Project[]>([]);
  const [tasks, setTasks] = useState<Tasks[]>([]);
  const [projectsOptions, setProjectOptions] = useState<Options[]>([]);
  const [projectStatuses, setProjectStatuses] = useState([]);
  const [token, setToken] = useState<string>("");
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [dialogtype, setDialogtype] = useState<"add" | "edit" | "view">("add");
  const [selectedTaskId, setSelectedTaskId] = useState("");
  const [getByIdLoading, setGetByIdLoading] = useState<boolean>(true);
  const [filteredTasks, setFilteredTasks] = useState<Tasks[]>([]);
  const [tableLoading, setTableLoading] = useState<boolean>(true);

  const methods = useForm<TaskFormValues>({
    defaultValues: {
      title: "",
      description: "",
      taskPriority: "",
      dueDate: new Date(),
      status: "",
      project: "",
      collaborators: [],
      files: [],
    },
    resolver: zodResolver(taskSchema),
    mode: "onChange",
  });

  const {
    handleSubmit,
    formState,
    getValues,
    watch,
    trigger,
    reset,
    setValue,
  } = methods;

  const [userData, setUsersData] = useState([]);
  const { userId, getToken } = useAuth();
  const handleSearchChange = (query: string) => {
    if (query.trim() === "") {
      setFilteredTasks(tasks);
    } else {
      const filtered = tasks.filter((task) =>
        task.title.toLowerCase().includes(query.toLowerCase())
      );
      setFilteredTasks(filtered);
    }
  };
  const askAiButtonClickHandler = async () => {
    try {
      setAiLoading(true);
      if (!getValues("title") || getValues("title").trim() === "")
        return alert("Please add tittle to ask Ai");
      const response = await askAi(getValues("title"), token as string);
      if (response.status === 200) {
        setValue("description", response.data.data.description);
      }
    } catch (err) {
      console.warn("Sonething went wwrong");
    } finally {
      setAiLoading(false);
    }
  };
  const getTaskData = async () => {
    try {
      setTableLoading(true);

      const response = await getTask(token);
      if (response.status === 200) {
        const newData = response.data.data.map((data: any) => {
          const {
            taskName,
            users,
            description,
            priority,
            createdAt,
            dueDate,
            ...rest
          } = data;
          return {
            createdBy: users,
            title: taskName,
            createdAt: createdAt ? format(createdAt, "PPP") : "--",
            dueDate: dueDate ? format(dueDate, "PPP") : "--",
            priority: priority,
            ...rest,
          };
        });
        setTasks(newData);
        // console.log(newData, "newData");
      }
    } catch (err) {
      console.warn("Something went wrong");
    } finally {
      setTableLoading(false);
    }
  };
  const taskColumns: ColumnDef<Tasks>[] = [
    {
      accessorKey: "title",
      header: "Task Name",
      enableSorting: true, 
      enableColumnFilter:true
    },
    {
      header: "Project Name",
      accessorKey: "projectId.title",
      enableSorting: true, 
    },
    {
      accessorKey: "dueDate",
      header: "Due Date",
      enableSorting: true, 
    },
    {
      accessorKey: "priority",
      header: "Priority",
      enableSorting: true, 
    },
    {
      accessorKey: "createdBy.fullName",
      header: "Created By",
      enableSorting: true, 
    },
    {
      accessorKey: "createdAt",
      header: "Created At",
      enableSorting: true,
      sortDescFirst: true,
    },
    {
      id: "actions",
      accessorKey: "action",
      header: "Action",
      enableHiding: false,
      cell: ({ row }) => {
        const isCreatedByCurrentUser = row.original.createdBy.userId === userId;
        const isRowIdValid = row.original._id !== undefined;

        // console.log(row.original.createdBy.userId === userId);

        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem
                onClick={() => {
                  setDialogtype("view");
                  setSelectedTaskId(row.original._id as string);
                  setIsDialogOpen(true);
                  getById();
                }}
              >
                View
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => {
                  setDialogtype("edit");
                  setIsDialogOpen(true);
                  setSelectedTaskId(row.original._id as string);
                  getById();
                }}
              >
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem
                disabled={!isCreatedByCurrentUser || !isRowIdValid}
                onClick={() => {
                  setSelectedTaskId(row.original._id as string);
                  setIsPopupOpen(true);
                }}
              >
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];
  const getData = async () => {
    try {
      const response = await getUsers();
      if (response.status === 200) {
        const getUsersExceptMe = response.data.data.filter(
          (user: User) => user.userId !== userId
        );

        setUsersData(
          getUsersExceptMe.map((user: User) => ({
            label: user.fullName,
            value: user._id,
          }))
        );
      }
    } catch (err) {
      console.warn("Something went wrong");
    }
  };
  const getProjectData = async () => {
    try {
      const response = await getProject(token);
      if (response.status === 200) {
        // console.log(response.data);
        setProjects(response.data.data);
        setProjectStatuses(
          response.data.data[0].status.map(
            (status: { value: string; label: string }) => ({
              value: status,
              label: status,
            })
          )
        );
        setProjectOptions(
          response.data.data.map((project: { _id: string; title: string }) => ({
            value: project._id,
            label: project.title,
          }))
        );
      }
    } catch (err) {
      console.warn("Something went wrong");
    }
  };
  const getById = async (id: string = selectedTaskId) => {
    try {
      setGetByIdLoading(true);
      const data = await getTaskById(id, token as string);
      if (data.status === 200) {
        setValue("title", data.data.data.taskName);
        setValue("description", data.data.data.description);
        setValue("status", data.data.data.status);
        setValue("taskPriority", data.data.data.priority);
        setValue("dueDate", data.data.data.dueDate);
        setValue("project", {
          value: data.data.data.projectId._id,
          label: data.data.data.projectId.title,
        });
        setValue("collaborators", [
          {
            value: data.data.data.assignedTo._id,
            label: data.data.data.assignedTo.fullName,
          },
        ]);
        setValue("files", data.data.data.attachments);
      }
    } catch (err) {
      console.log("");
    } finally {
      setGetByIdLoading(false);
    }
  };
  const onSubmit = async (data: TaskFormValues) => {
    try {
      const formData = new FormData();

      formData.append("taskName", data.title);
      formData.append("description", data.description as string);
      formData.append("status", data.status as string);
      // @ts-ignore
      formData.append("priority", data.taskPriority.value);
      formData.append("dueDate", data.dueDate as string);

      if (data.collaborators?.length) {
        formData.append("assignedTo", data.collaborators[0].value);
      } else {
        formData.append("assignedTo", JSON.stringify(null));
      }

      // @ts-ignore
      formData.append("projectId", data.project.value);

      if (data.files) {
        data.files.forEach((file: File) => {
          if (file) {
            // console.log(file);
            formData.append("files", file);
          }
        });
      }
      setLoading(true);
      setGetByIdLoading(true);
      if (dialogtype === "add") {
        const response = await createTask(formData as any, token as string);

        if (response.status === 201) {
          reset();
          toast({
            title: response.data.message,
          });
        }
      } else {
        const response = await editTask(
          formData,
          selectedTaskId as string,
          token as string
        );
        if (response.status === 200) {
          // console.log(response.data);
          getById();
          setIsDialogOpen(false);
          toast({
            title: "Data updated successfully",
          });
        }
      }
      reset();
      setIsDialogOpen(true);
    } catch (err) {
      toast({
        title: "An error occurred",
        description: "Please try again later.",
      });
    } finally {
      setIsDialogOpen(false);
      setLoading(false);
      setGetByIdLoading(false);
      getTaskData();
    }
  };

  const handleAction = async () => {
    try {
      setLoading(true);
      const resopose = await removeTask(selectedTaskId, token as string);
      if (resopose.status === 200) {
        toast({
          title: "Project deleted suffessfully",
        });
        getTaskData();
        setIsPopupOpen(false);
      }
    } catch {
      toast({
        title: "An error occurred",
        description: "Please try again later.",
      });
    } finally {
      setLoading(false);
    }
  };
  const handleClose = (_: boolean) => {
    setIsDialogOpen(false);
    reset();
  };
  const removeAttachments = async (data: any) => {
    try {
      const cleanedArray = getValues("files").filter(
        (obj: { _id: string }) => obj._id === data?._id
      );
      setValue("files", cleanedArray);

      const response = await editTask(
        {
          deletedAttachments: cleanedArray.map(
            (file: { _id: string }) => file._id
          ),
        },
        selectedTaskId as string,
        token as string
      );
      if ((response.status = 201)) {
        // console.log(response.data);
        getById();
      }
      // response
    } catch (err) {
      console.warn("Something went wrong");
    }
  };
  useEffect(() => {
    getData();
    getProjectData();
    if (token.trim() !== "") {
      getTaskData();
    }
  }, [token]);
  useEffect(() => {
    if (selectedTaskId && dialogtype !== "add") {
      getById();
    }
  }, [selectedTaskId, dialogtype]);
  useEffect(() => {
    const intervalId = setInterval(() => {
      getToken().then((token) => {
        setToken(token as string);
      });
    }, 2000);
    return () => clearInterval(intervalId);
  }, []);
  useEffect(() => {
    const subscription = watch(() => {});
    return () => subscription.unsubscribe();
  }, [watch, formState.errors]);

  useEffect(() => {
    trigger();
  }, [trigger]);

  useEffect(() => {
    setFilteredTasks(tasks);
  }, [tasks]);

  return (
    <>
      <div className="flex gap-4 flex-col">
        <p className="text-lg font-medium">My Tasks</p>
        <div className="flex justify-between items-center">
          <div className="flex w-full items-center gap-4">
            <div>
              <Label>Search by title</Label>
              <Searchbar
                placeholder="Search By Task Name..."
                onSearchChange={handleSearchChange}
              />
            </div>
          </div>
          <Button
            variant={"default"}
            onClick={() => {
              setIsDialogOpen(true);
              setDialogtype("add");
            }}
          >
            Add Task
          </Button>
        </div>
        {!tableLoading ? (
          <DataTable columns={taskColumns} data={filteredTasks} />
        ) : (
          <div className="w-full rounded-lg border justify-center items-center flex bg-[#FFFFFF] min-h-[60vh]">
            <Loader color="black" />
          </div>
        )}{" "}
        <ConfirmPopup
          loading={loading}
          isOpen={isPopupOpen}
          setIsOpen={setIsPopupOpen}
          title="Are you absolutely sure?"
          description="Are you sure you want to selete this."
          cancelLabel="Cancel"
          actionLabel="Continue"
          onAction={handleAction}
        />
        <FormProvider {...methods}>
          <InputDialog
            askAiButtonClick={askAiButtonClickHandler}
            popUpType={dialogtype}
            isOpen={isDialogOpen}
            askAiLoading={aiLoading}
            setIsOpen={setIsDialogOpen}
            hadleClose={handleClose}
            removeAttachments={removeAttachments}
            title={dialogtype === "edit" ? "Edit Task" : "Add Task"}
            inputFields={taskDialogInputFields.map((field) =>
              getFieldWithOptions(
                field,
                userData,
                projectStatuses,
                projectsOptions
              )
            )}
            getByIdLoading={getByIdLoading}
            formMethods={methods}
            onSubmit={handleSubmit(onSubmit)}
            submitLabel={
              dialogtype === "edit" ? "Update changes" : "Save changes"
            }
            loading={loading}
          />
        </FormProvider>
      </div>
    </>
  );
};

export default Task;
