import { RouterProvider } from "react-router-dom";
import "./App.css";
import Routes from "./constants/appRoutes";
import { Toaster } from "./components/ui/toaster";
import { SocketProvider } from "./context/socketContext";

function App() {
  return (
    <>
      <SocketProvider>
        <RouterProvider router={Routes} />
        <Toaster />
      </SocketProvider>
    </>
  );
}

export default App;
