import { UserData } from "@/constants/interface";
import { saveUserData } from "@/services/api";
import { SignedIn, useUser } from "@clerk/clerk-react";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const { user } = useUser();
  const navigate = useNavigate()
  const syncUserWithDB = async () => {
    try {
      const payload = {
        fullName: user?.fullName,
        email: user?.primaryEmailAddress?.emailAddress,
        userId: user?.id,
      };
      await saveUserData(payload as UserData);
    } catch (err) {
      console.warn(err);
    }
  };
  useEffect(() => {
    syncUserWithDB();
    navigate('/intelli-tasks/board')
  }, []);
  return (
    <div>
      <SignedIn></SignedIn>
    </div>
  );
};

export default Dashboard;
