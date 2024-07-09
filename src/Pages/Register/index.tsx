import { pageRoutes } from "@/lib/pageRoutes";
import { SignUp } from "@clerk/clerk-react";

const Register = () => {
  return (
    <div className="w-full flex items-center h-screen justify-center bg-black">
      <SignUp afterSignUpUrl={`${pageRoutes.INTELLITASKS}/${pageRoutes.DASHBOARD}`} signInUrl="/sign-in" />
    </div>
  );
};

export default Register;
