import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useNavigate } from "react-router-dom";

export function UserAvatar({ avatar }: { avatar: string | null }) {
  const navigate = useNavigate();

  return (
    <Avatar onClick={() => navigate("/profile")}>
      <AvatarImage
        src={avatar ? avatar : "https://github.com/shadcn.png"}
        alt="@shadcn"
      />
      <AvatarFallback>CN</AvatarFallback>
    </Avatar>
  );
}
