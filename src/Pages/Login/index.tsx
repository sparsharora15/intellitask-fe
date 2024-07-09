import { pageRoutes } from "@/lib/pageRoutes";
import { SignIn } from "@clerk/clerk-react";

const Login = () => {
  return (
    <div className="w-full flex items-center h-screen justify-center bg-black">
      <SignIn signUpUrl="/sign-up" afterSignInUrl={`${pageRoutes.INTELLITASKS}/${pageRoutes.DASHBOARD}`} />
    </div>
  );
};

export default Login;
