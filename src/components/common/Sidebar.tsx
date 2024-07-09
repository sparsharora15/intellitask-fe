import { cn } from "@/lib/utils";
import { routes } from "@/lib/data";
import { Link, useLocation } from "react-router-dom";
import { pageRoutes } from "@/lib/pageRoutes";

export const Sidebar = () => {
  const { pathname } = useLocation();

  return (
    <div className="space-y-4 py-4 flex flex-col h-full bg-[#111827] text-white">
      <div className="px-3 py-2 flex-1">
        <Link to={`${pageRoutes.INTELLITASKS}/${pageRoutes.DASHBOARD}`} className="flex items-center pl-3 mb-14 ">
          <div className="relative w-8 h-8 mr-2">
            {/* <Image src={"/logo.png"}
                            fill
                            alt='Predictpros Logo'
                        /> */}
          </div>
          <h1 className={cn("text-2xl font-bold")}>IntelliTasks</h1>
        </Link>
        <div className="space-y-1">
          {routes.map((route) => (
            <Link
              to={route.href}
              key={route.href}
              className={cn(
                "text-sm group flex p-3 w-full justify-start font-medium cursor-pointer hover:text-white hover:bg-white/10 rounded-lg transition",
                pathname === route.href ? "text-white bg-white/10" : ""
              )}
            >
              <div className="flex items-center flex-1">
                <route.icon className={cn("h-5 w-5 mr-3", route.color)} />
                {route.label}
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};
