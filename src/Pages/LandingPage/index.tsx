import { BackgroundBoxes } from "@/components/common/BackgroundBoxes";
// import { useEffect } from "react";
// import { useAuth } from "@clerk/clerk-react";
// import { useNavigate } from "react-router-dom";
// import { pageRoutes } from "@/lib/pageRoutes";

const LandingPage = () => {
  // const { userId, isLoaded } = useAuth();
  // const navigate = useNavigate();

  // useEffect(() => {
  //   if (userId && isLoaded) {
  //     navigate(`${pageRoutes.INTELLITASKS}/${pageRoutes.DASHBOARD }`);
  //   }
  // }, [userId, isLoaded]);

  // if (isLoaded) {
    return (
      <div className="bg-black h-screen">
        <BackgroundBoxes />
      </div>
    );
  }
// };

export default LandingPage;
