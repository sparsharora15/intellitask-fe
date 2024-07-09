import { Link } from "react-router-dom";
import { Button } from "../ui/button";
import { useUser } from "@clerk/clerk-react";
import { pageRoutes } from "@/lib/pageRoutes";

const AuthButtons = () => {
  const { isSignedIn } = useUser();

  return (
    <div className="flex gap-4 mt-6">
      <Link to={isSignedIn ? `${pageRoutes.INTELLITASKS}/${pageRoutes.DASHBOARD}` : "/sign-up"}>
        <Button className="px-4 text-white capitalize">Get Started</Button>{" "}
      </Link>
    </div>
  );
};

export default AuthButtons;
