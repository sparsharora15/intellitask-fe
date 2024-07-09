import {  UserButton } from "@clerk/clerk-react";
import { MobileSidebar } from "../common/MobileSidebar";
import { BellRing } from "lucide-react";
import { cn } from "@/lib/utils";
export const Navbar = () => {
  return (
    <div className="flex  items-center p-4">
      <MobileSidebar />
      <div className="flex  w-full justify-between">
        <div className="flex items-center gap-[5px] justify-center">
          <h1 className={cn("text-2xl font-bold")}>IntelliTasks</h1>
        </div>
        <div className="flex items-center justify-center gap-3">
          <BellRing />
          <UserButton afterSignOutUrl="/" />
        </div>
      </div>
    </div>
  );
};
