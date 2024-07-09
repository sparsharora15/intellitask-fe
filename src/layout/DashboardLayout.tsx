import { useEffect } from "react";
import { useAuth } from "@clerk/clerk-react";
import { Outlet, useNavigate } from "react-router-dom";
import { Navbar } from "@/components/ui/Navbar";
import { Sidebar } from "@/components/common/Sidebar";

const DashboardLayout = () => {
  const { userId, isLoaded } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!userId && isLoaded) {
      navigate("/sign-in");
    }
  }, [userId, isLoaded]);

  if (isLoaded) {

    return (
      <div className="h-full relative">
        <div className="hidden h-full md:flex md:flex-col md:fixed md:inset-y-0 z-[80] bg-gray-900 md:w-72 ">
          <Sidebar />
        </div>
        <main className="md:pl-72 bg-[#f1f1f1]">
          <div className="shadow-lg bg-[#f1f1f1] sticky top-0 z-10">
            <Navbar />
          </div>
          <div
            className="overflow-y-scroll p-4"
            style={{ height: "calc(100vh - 64px)" }}
          >
            <Outlet />
          </div>
        </main>
      </div>
    );
  }
};

export default DashboardLayout;
