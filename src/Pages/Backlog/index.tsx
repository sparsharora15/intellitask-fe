import { DataTable } from "@/components/common/DataTable";
import Loader from "@/components/common/Loader";
import Searchbar from "@/components/common/Searchbar";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { backlogDialogInputFields, Tasks } from "@/lib/data";
import { editTask, getUnassignedTasks, getUsers } from "@/services/api";
import { useAuth } from "@clerk/clerk-react";
import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import { useEffect, useState } from "react";
import {
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenu,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal } from "lucide-react";
import { BackFormValues, backlogSchema } from "@/lib/schema/Schemas";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import InputDialog from "@/components/DialogBoxes/InputDialog";
import { useToast } from "@/components/ui/use-toast";
import { User } from "@/constants/interface";
import { getFieldWithOptions } from "@/lib/utils";
const Backlog = () => {
  const methods = useForm<BackFormValues>({
    defaultValues: {
      collaborators: [],
    },
    resolver: zodResolver(backlogSchema),
    mode: "onChange",
  });

  const {
    handleSubmit,
    formState,
    watch,
    trigger,
    reset,
  } = methods;
  const [tasks, setTasks] = useState<Tasks[]>([]);
  const [loading, ] = useState(false);

  const [filteredTasks, setFilteredTasks] = useState<Tasks[]>([]);
  const [tableLoading, setTableLoading] = useState<boolean>(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { getToken, userId } = useAuth();
  const [userData, setUsersData] = useState([]);
  const [token, setToken] = useState<string>("");
  const [getByIdLoading, ] = useState<boolean>(true);
  const [selectedTaskId, setSelectedTaskId] = useState("");

  const { toast } = useToast();
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
  const taskColumns: ColumnDef<Tasks>[] = [
    {
      accessorKey: "title",
      header: "Task Name",
    },
    {
      header: "Project Name",
      accessorKey: "projectDetails.title",
    },
    {
      accessorKey: "dueDate",
      header: "Due Date",
    },
    {
      accessorKey: "priority",
      header: "Priority",
    },
    {
      accessorKey: "createdByUserDetails.fullName",
      header: "Created By",
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
                  setSelectedTaskId(row.original._id as string);
                  setIsDialogOpen(true);
                }}
              >
                Add Collaborators
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];
  const getTasks = async () => {
    try {
      setTableLoading(true);
      const response = await getUnassignedTasks(token as string);
      // console.log(response);
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
      console.warn(err);
    } finally {
      setTableLoading(false);
    }
  };
  const handleClose = (_: boolean) => {
    setIsDialogOpen(false);
    reset();
  };
  const onSubmit = async (data: BackFormValues) => {
    try {
      if (data.collaborators?.length === 0) return;
      const formData = new FormData();

      if (data.collaborators?.length === 0) return;
      // @ts-ignore
      formData.append("assignedTo", data.collaborators[0].value);

      const response = await editTask(
        formData,
        selectedTaskId as string,
        token as string
      );
      if (response.status === 200) {
        getTasks();
        setIsDialogOpen(false);
        toast({
          title: "Collaborators assigned successfully",
        });
      }
    } catch (err) {
      console.warn("Something went wrong");
    }
  };
  useEffect(() => {
    const intervalId = setInterval(() => {
      getToken().then((token) => {
        setToken(token as string);
      });
    }, 2000);
    return () => clearInterval(intervalId);
  }, []);
  useEffect(() => {
    getData();
  }, []);
  useEffect(() => {
    if (token.trim() !== "") {
      getTasks();
    }
  }, [token]);
  useEffect(() => {
    setFilteredTasks(tasks);
  }, [tasks]);

  useEffect(() => {
    const subscription = watch(() => {});
    return () => subscription.unsubscribe();
  }, [watch, formState.errors]);

  useEffect(() => {
    trigger();
  }, [trigger]);

  return (
    <>
      <div className="flex flex-col gap-4">
        <p className="text-lg font-medium">My Tasks</p>

        <div className="flex justify-between items-center">
          <div className="flex w-full items-center gap-4">
            <div>
              <Label>Search By Title</Label>
              <Searchbar
                placeholder="Search By Task Name..."
                onSearchChange={handleSearchChange}
              />
            </div>
          </div>
        </div>
        {!tableLoading ? (
          <DataTable columns={taskColumns} data={filteredTasks} />
        ) : (
          <div className="w-full rounded-lg border justify-center items-center flex bg-[#FFFFFF] min-h-[60vh]">
            <Loader color="black" />
          </div>
        )}
      </div>
      <FormProvider {...methods}>
        <InputDialog
          isOpen={isDialogOpen}
          setIsOpen={setIsDialogOpen}
          hadleClose={handleClose}
          title={"Add Collaborator"}
          // inputFields={backlogDialogInputFields}
          inputFields={backlogDialogInputFields.map((field) =>
            getFieldWithOptions(field, userData)
          )}
          getByIdLoading={getByIdLoading}
          formMethods={methods}
          onSubmit={handleSubmit(onSubmit)}
          submitLabel={"Save changes"}
          loading={loading}
        />
      </FormProvider>
    </>
  );
};

export default Backlog;
