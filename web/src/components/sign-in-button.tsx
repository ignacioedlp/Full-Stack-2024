import { ExitIcon } from "@radix-ui/react-icons";
import { UserAvatar } from "./user-avatar";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/auth-provider";
import { useNavigate } from "react-router-dom";

const SignInButton = () => {
  const { user, clearAuth } = useAuth();
  const navigate = useNavigate();

  const handleLogOut = () => {
    clearAuth();
    navigate("/login");
  };

  if (user)
    return (
      <div className="flex gap-4 ml-auto">
        <UserAvatar avatar={user.avatar} />
        <Button
          type="button"
          variant="destructive"
          size="icon"
          onClick={() => {
            handleLogOut();
          }}
        >
          <ExitIcon className="h-[1rem] w-[1rem]" />
        </Button>
      </div>
    );

  return (
    <div className="flex items-center gap-4 ml-auto">
      <Button
        type="button"
        variant="default"
        onClick={() => navigate("/login")}
      >
        Sign In
      </Button>
      <Button
        type="button"
        variant="outline"
        onClick={() => navigate("/signup")}
      >
        Sign Up
      </Button>
    </div>
  );
};

export default SignInButton;
