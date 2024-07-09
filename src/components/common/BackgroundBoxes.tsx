import React from "react";
import { Boxes } from "./Boxes";
import { FlipWords } from "./FlipWords";
import { valuesListHomepage } from "../../lib/data";
import AuthButtons from "./AuthButtons";
// const words = ["eligible", "cute", "beautiful", "modern"];

const BackgroundBoxesCore = () => {
  return (
    <div className="h-[40rem] min-h-full relative w-full overflow-hidden bg-black flex flex-col items-center justify-center rounded-lg">
      <div className="absolute inset-0 w-full h-full bg-black z-20 [mask-image:radial-gradient(transparent,white)] pointer-events-none" />

      <Boxes />

      <div className="h-fit flex flex-col  justify-center items-center px-4 relative z-20">
        <div className="text-center	text-2xl md:text-5xl mx-auto font-semibold text-white">
          Discover 
          <FlipWords words={valuesListHomepage} /> <br />
          Ways to Work with IntelliTasks
        </div>
        <AuthButtons />
      </div>
    </div>
  );
};

export const BackgroundBoxes = React.memo(BackgroundBoxesCore);
