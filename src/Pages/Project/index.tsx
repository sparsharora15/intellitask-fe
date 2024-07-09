import { useEffect, useState } from "react";
import Searchbar from "@/components/common/Searchbar";
import { DataTable } from "@/components/common/DataTable";
import { projectDialogInputFields, Project as ProjectTypes } from "@/lib/data";
import { DropdownMenu } from "@radix-ui/react-dropdown-menu";
import {
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal } from "lucide-react";
import ConfirmPopup from "@/components/common/ConfirmPopup";
import InputDialog from "@/components/DialogBoxes/InputDialog";
import { ProjectFormValues, projectSchema } from "@/lib/schema/Schemas";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  askAi,
  createProject,
  editProject,
  getProject,
  getProjectById,
  getUsers,
  removeProject,
} from "@/services/api";
import { useAuth } from "@clerk/clerk-react";
import { ProjectData, User } from "@/constants/interface";
import { useToast } from "@/components/ui/use-toast";
import { format } from "date-fns";
import Loader from "@/components/common/Loader";

const Project = () => {
  const { toast } = useToast();
  const [token, setToken] = useState<string>("");
  const [getByIdLoading, setGetByIdLoading] = useState<boolean>(true);
  const [loading, setLoading] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [userData, setUsersData] = useState([]);
  const [selectedProjectId, setSelectedProjectId] = useState("");
  const { userId, getToken } = useAuth();
  const [projects, setProjects] = useState<ProjectTypes[]>([]);
  const [dialogtype, setDialogtype] = useState<"add" | "edit" | "view">("add");
  const [filteredProjects, setFilteredProjects] = useState<ProjectTypes[]>([]);
  const [, setProjectDataById] = useState<any>({});
  const [tableLoading, setTableLoading] = useState<boolean>(true);

  const methods = useForm<ProjectFormValues>({
    defaultValues: {
      title: "",
      description: "",
      taskStatus: [],
      collaborators: [],
    },
    resolver: zodResolver(projectSchema),
    mode: "onChange",
  });

  const {
    handleSubmit,
    formState,
    getValues,
    watch,
    setValue,
    trigger,
    reset,
  } = methods;
  const handleSearchChange = (query: string) => {
    if (query.trim() === "") {
      setFilteredProjects(projects);
    } else {
      const filtered = projects.filter((projects) =>
        projects.title.toLowerCase().includes(query.toLowerCase())
      );
      // console.log(filtered);
      setFilteredProjects(filtered);
    }
  };
  const onSubmit = (data: ProjectFormValues) => {
    try {
      const payload = {
        title: data.title,
        description: data.description ?? "",
        status: data.taskStatus.map((status) => status.value) ?? [],
        users:
          data.collaborators?.map((colaborator) => colaborator.value) ?? [],
      };

      getToken().then(async (token) => {
        setLoading(true);
        if (dialogtype === "add") {
          const response = await createProject(
            payload as ProjectData,
            token as string
          );
          if (response.status === 201) {
            toast({
              title: response.data.message,
            });
            getProjectData();
            setIsDialogOpen(false);
          }
        } else {
          const response = await editProject(
            payload as ProjectData,
            selectedProjectId,
            token as string
          );
          if (response.status === 200) {
            getProjectData();
            toast({
              title: response.data.message,
            });
            setIsDialogOpen(false);
          }
        }
      });
      reset();
      setIsDialogOpen(true);
    } catch (err) {
      toast({
        title: "An error occurred",
        description: "Please try again later.",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAction = async () => {
    try {
      setLoading(true);
      const resopose = await removeProject(selectedProjectId, token as string);
      if (resopose.status === 200) {
        toast({
          title: "Project deleted suffessfully",
        });
        getProjectData();
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

  const columns: ColumnDef<ProjectTypes>[] = [
    {
      accessorKey: "title",
      header: "Project Name",
    },
    {
      accessorKey: "totalUser",
      header: "Total User",
    },
    {
      accessorKey: "createdAt",
      header: "Created At",
    },
    {
      id: "actions",
      accessorKey: "action",
      header: "Action",
      enableHiding: false,
      cell: ({ row }) => {
        const isCreatedByCurrentUser = row.original.createdBy.userId === userId;
        const isRowIdValid = row.original._id !== undefined;

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
                  getById(row.original._id);
                  setSelectedProjectId(row.original._id as string);
                  setIsDialogOpen(true);
                }}
              >
                View
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => {
                  setDialogtype("edit");
                  setIsDialogOpen(true);
                  getById(row.original._id);
                  setSelectedProjectId(row.original._id as string);
                }}
              >
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem
                disabled={!isCreatedByCurrentUser || !isRowIdValid}
                onClick={() => {
                  if (isCreatedByCurrentUser && isRowIdValid) {
                    getById(row.original._id);
                    setSelectedProjectId(row.original._id as string);
                    setIsPopupOpen(true);
                  }
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
  const getById = async (id: string = selectedProjectId) => {
    try {
      setGetByIdLoading(true);

      const data = await getProjectById(id, token as string);
      if (data.status === 200) {
        const projectdata = {
          title: data.data.data.title,
          description: data.data.data.description,
          taskStatus: data.data.data.status.map((status: any) => ({
            value: status,
            label: status,
          })),
          collaborators: data.data.data.users.map((user: any) => ({
            value: user._id,
            label: user.fullName,
          })),
        };
        setValue("title", projectdata.title);
        setValue("description", projectdata.description);
        setValue("taskStatus", projectdata.taskStatus);
        setValue("collaborators", projectdata.collaborators);
        setProjectDataById(projectdata);
      }
    } catch (err) {
      // console.log("");
    } finally {
      setGetByIdLoading(false);
    }
  };
  const getProjectData = async () => {
    try {
      setTableLoading(true);

      const response = await getProject(token);
      if (response.status === 200) {
        const newData = response.data.data.map((data: any) => {
          const { users, createdAt, ...rest } = data;
          return {
            totalUser: users.length,
            createdAt: createdAt ? format(createdAt, "PPP") : "--",
            ...rest,
          };
        });
        setProjects(newData);
      }
    } catch (err) {
      console.warn("Something went wrong");
    } finally {
      setTableLoading(false);
    }
  };
  const hadleClose = () => {
    setIsDialogOpen(false);
    reset();
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
  useEffect(() => {
    const subscription = watch(() => {});
    return () => subscription.unsubscribe();
  }, [watch, formState.errors]);
  useEffect(() => {
    setFilteredProjects(projects);
  }, [projects]);

  useEffect(() => {
    trigger();
  }, [trigger]);
  useEffect(() => {
    getData();
  }, []);
  useEffect(() => {
    getData();
    if (token.trim() !== "") {
      getProjectData();
    }
  }, [token]);
  useEffect(() => {
    getToken().then((token) => {
      setToken(token as string);
    });
  }, []);

  useEffect(() => {
    if (selectedProjectId) {
      getById();
    }
  }, [selectedProjectId]);
  return (
    <div className="flex gap-4 flex-col">
      <p className="text-lg font-medium">My Projects</p>

      <div className="flex w-full items-center gap-4 justify-between">
        <Searchbar
          placeholder="Search By Project Name..."
          onSearchChange={handleSearchChange}
        />
        <Button
          variant={"default"}
          onClick={() => {
            setIsDialogOpen(true);
            setDialogtype("add");
          }}
        >
          Add Project
        </Button>
      </div>
      {!tableLoading ? (
        <DataTable columns={columns} data={filteredProjects} />
      ) : (
        <div className="w-full rounded-lg border justify-center items-center flex bg-[#FFFFFF] min-h-[60vh]">
          <Loader color="black" />
        </div>
      )}
      <ConfirmPopup
        isOpen={isPopupOpen}
        setIsOpen={setIsPopupOpen}
        title="Are you absolutely sure?"
        description="Are you sure you want to delete this project?"
        cancelLabel="Cancel"
        actionLabel="Continue"
        onAction={handleAction}
        loading={loading}
      />
      <FormProvider {...methods}>
        <InputDialog
          askAiButtonClick={askAiButtonClickHandler}
          isOpen={isDialogOpen}
          popUpType={dialogtype}
          setIsOpen={setIsDialogOpen}
          askAiLoading={aiLoading}
          hadleClose={hadleClose}
          getByIdLoading={getByIdLoading}
          title={dialogtype === "edit" ? "Edit Project" : "Add Project"}
          inputFields={projectDialogInputFields.map((field) =>
            field.id === "collaborators"
              ? { ...field, options: userData ?? [] }
              : field
          )}
          formMethods={methods}
          onSubmit={handleSubmit(onSubmit)}
          submitLabel={
            dialogtype === "edit" ? "Update changes" : "Save changes"
          }
          loading={loading}
        />
      </FormProvider>
    </div>
  );
};

export default Project;
