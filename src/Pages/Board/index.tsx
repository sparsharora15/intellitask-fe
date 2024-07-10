import CustomBoard from "@/components/common/CustomBoard";
import CustomSelect from "@/components/common/CustomSelect";
// import Searchbar from "@/components/common/Searchbar";
import { Label } from "@/components/ui/label";
import { Options } from "@/constants/interface";
import { getProject, getTasksByProjectId } from "@/services/api";
import { useAuth } from "@clerk/clerk-react";
import { useEffect, useState } from "react";
import data from "../../../data.json";
import { removeHtml, Tasks } from "@/lib/data";
import { useSocket } from "../../context/socketContext";

const Board = () => {
  const socket = useSocket();
  const [projectData, setProjectsData] = useState([]);
  const [token, setToken] = useState<string>("");
  const [projectStatuses, setProjectStatuses] = useState<string[]>([]);
  const [boardData, setBoardData] = useState<any>(null);
  const [taskData, setTaskData] = useState<Tasks[]>([]);
  const [, setStatus] = useState<string>("");
  const [, setCard] = useState<Tasks | null>(null);
  const { getToken } = useAuth();

  const [selectedProject, setSelectedProject] = useState<Options>(
    projectData[0]
  );

  const handleSelectChange = (selectedOption: Options) => {
    setSelectedProject(selectedOption);
    // console.log(selectedOption);
    socket?.emit("joinProject", { projectId: selectedOption.value });
  };
  const getData = async () => {
    try {
      const response = await await getProject(token as string);
      if (response.status === 200) {
        const newData = response.data.data.map((data: any) => ({
          value: data?._id,
          label: data?.title,
        }));
        setProjectsData(newData);
      }
    } catch (err) {
      console.warn("Something went wrong");
    }
  };
  const getTasksData = async () => {
    try {
      const response = await getTasksByProjectId(
        token,
        selectedProject.value as string
      );
      if (response.data.data.status === 200) {
        setProjectStatuses(response.data.data.statuses);
        setTaskData(response.data.data.tasks);
      }
      const transformedTasks = response.data.data.tasks.map((task: any) => {
        const { taskName, description, ...rest } = task;
        return {
          title: taskName,
          description: removeHtml(description),
          cardStyle: {
            width: 270,
            maxWidth: 270,
            margin: "auto",
            maxHeight: 300,
            marginBottom: 5,
          },
          ...rest,
        };
      });

      // Initialize the boardObject with lanes
      let boardObject: any = {
        lanes: [],
      };

      // Populate lanes based on response.data.data.statuses
      response.data.data.statuses.forEach((status: any) => {
        boardObject.lanes.push({
          id: status.toLowerCase(),
          style: { width: 280 },
          cards: [], // Initialize empty cards array
        });
      });

      // Log transformed tasks for debugging
      // console.log("Transformed tasks:", transformedTasks);

      // Create a dictionary to categorize tasks
      let tasksCategorized: { [key: string]: any[] } = {};

      // Populate the tasksCategorized dictionary
      transformedTasks.forEach((task: any) => {
        const taskStatus = task.status.toLowerCase();
        if (!tasksCategorized[taskStatus]) {
          tasksCategorized[taskStatus] = [];
        }
        tasksCategorized[taskStatus].push(task);
      });

      // Update lanes with tasks and labels
      boardObject.lanes.forEach((lane: any) => {
        const tasksForLane = tasksCategorized[lane.id] || [];
        lane.cards = tasksForLane;
        lane.label = tasksForLane.length.toString(); // Convert number to string for the label
        lane.title = lane.id.toLocaleUpperCase(); // Set the title of the lane
      });

      // Set the boardData state with the transformed boardObject
      setBoardData(boardObject);
    } catch (err) {
      console.warn("Something went wrong");
    }
  };
  useEffect(() => {
    if (token.trim() !== "") {
      getData();
    }
  }, [token]);
  useEffect(() => {
    if (selectedProject) {
      getTasksData();
    }
  }, [selectedProject]);
  useEffect(() => {
    const intervalId = setInterval(() => {
      getToken().then((token) => {
        setToken(token as string);
      });
    }, 2000);
    return () => clearInterval(intervalId);
  }, []);
  useEffect(() => {
    if (socket) {
      socket.on("taskUpdated", (data) => {
        // console.log("data from socket", data);
        const updatedLanes = boardData?.lanes?.map((lane: any) => {
          // Remove the card from its current lane if it exists
          lane.cards = lane.cards.filter((card: any) => card._id !== data._id);

          // If the card's status matches the current lane id, add it to this lane
          if (lane.id === data.status) {
            data.title = data.taskName;
            lane.cards.push(data);
          }

          return lane;
        });
        if (updatedLanes.length) {
          let tempBoardData = { lanes: updatedLanes };
          setBoardData(tempBoardData);
        }
      });
    }

    return () => {
      if (socket) {
        socket.off("taskUpdated");
      }
    };
  }, [socket]);
  useEffect(() => {}, [data, projectStatuses, taskData]);
  return (
    <>
      <div className="flex gap-4 flex-col">
        <p className="text-lg font-medium">Board</p>

        <div className="flex w-full items-center gap-4">
          {/* <div>s */}
          <div>
            <Label>Sort by projects</Label>
            <CustomSelect
              className="min-w-[10rem]"
              isClearable
              defaultValue={projectData[0]}
              options={projectData}
              onChange={handleSelectChange}
            />
          </div>
        </div>
        {boardData && (
          <CustomBoard
            setBoardData={setBoardData as any}
            setStatus={setStatus}
            setCard={setCard}
            boardData={boardData as any}
          />
        )}
      </div>
    </>
  );
};

export default Board;
