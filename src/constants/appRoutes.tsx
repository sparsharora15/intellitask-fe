import { createBrowserRouter } from "react-router-dom";
import LandingPage from "@/Pages/LandingPage";
import Layout from "@/layout/DefaultLayout";
import { pageRoutes } from "@/lib/pageRoutes";
import Login from "@/Pages/Login";
import Register from "@/Pages/Register";
import DashboardLayout from "@/layout/DashboardLayout";
import Dashboard from "@/Pages/Dashboard";
import Backlog from "@/Pages/Backlog";
import Project from "@/Pages/Project";
import Task from "@/Pages/Task";
import Board from "@/Pages/Board"
// import CustomBoard from "@/Pages/Board";
const Routes = createBrowserRouter([
  { path: "/", element: <LandingPage /> },
  {
    element: <Layout />,
    children: [
      { path: pageRoutes.LOGIN_IN, element: <Login /> },
      { path: pageRoutes.REGISTER, element: <Register /> },
      {
        element: <DashboardLayout />,
        path: pageRoutes.INTELLITASKS,
        children: [
          { path: pageRoutes.DASHBOARD, element: <Dashboard /> },
          { path: pageRoutes.BOARD, element: <Board /> },
          { path: pageRoutes.BACKLOG, element: <Backlog /> },
          { path: pageRoutes.PROJECTS, element: <Project /> },
          { path: pageRoutes.TASKS, element: <Task /> },
        ],
      },
    ],
  },
]);

export default Routes;
