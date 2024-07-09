import React from "react";
import { ClipLoader } from "react-spinners";
interface LoaderProps {
  color?: string;
}
const Loader: React.FC<LoaderProps> = ({ color = "white" }) => {
  return (
    <div className="w-full flex items-center justify-center">
      <ClipLoader color={color} className="!h-[25px] !w-[25px]" />
    </div>
  );
};

export default Loader;
