import React from "react";
// const Board = lazy(() => import("react-trello-ts"));
import Board from "react-trello-ts";
import { useSocket } from "../../context/socketContext";

interface Card {
  id: string;
  title: string;
  label: string;
  cardStyle: {
    width: number;
    maxWidth: number;
    margin: string;
    marginBottom: number;
  };
  description: string;
}

interface Lane {
  id: string;
  title: string;
  label: string;
  style: {
    width: number;
  };
  cards: Card[];
}

interface BoardData {
  lanes: Lane[];
}

interface CustomBoardProps {
  boardData: BoardData;
  setBoardData: (data: BoardData) => void;
  setCard: any;
  setStatus: any;
}

const CustomBoard: React.FC<CustomBoardProps> = ({
  boardData,
  setCard,
  setStatus,
}) => {
  const socket = useSocket();

  return (
    <div className="">
      {boardData?.lanes?.length > 0 ? (
        <Board
          style={{ backgroundColor: "unset", padding: "0px" }}
          data={boardData}
          handleDragEnd={(_a, _, status, _s, card) => {
            socket?.emit("updateTaskStatus", {
              projectId: card.projectId._id,
              taskId: card._id,
              status: { status },
            });
            setCard(card);
            setStatus(status);
          }}
          draggable
        />
      ) : null}
    </div>
  );
};

export default CustomBoard;
