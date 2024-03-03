import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import ThemeSwitch from "./theme-switch";
import SignInButton from "./sign-in-button";
import { useAuth } from "@/contexts/auth-provider";
import { Button } from "./ui/button";
import { useNavigate } from "react-router-dom";
import LocaleSwitch from "./locale-switch";
import { useTranslation } from "react-i18next";

type ListItem = {
  title: string;
  href: string;
  description: string | undefined;
};

export function NavBar() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const components: {
    [key: string]: ListItem[];
  } = {
    Admin: [
      {
        title: t("navbar.home"),
        href: "/home",
        description: undefined,
      },
      {
        title: t("navbar.about"),
        href: "/about",
        description: undefined,
      },
      {
        title: t("navbar.admin"),
        href: "/admin",
        description: undefined,
      },
    ],
    User: [
      {
        title: t("navbar.home"),
        href: "/home",
        description: undefined,
      },
      {
        title: t("navbar.about"),
        href: "/about",
        description: undefined,
      },
    ],
    default: [
      {
        title: t("navbar.about"),
        href: "/about",
        description: undefined,
      },
    ],
  };

  return (
    <div className="flex items-center justify-between w-full pt-4">
      <NavigationMenu>
        <NavigationMenuList>
          {components[user?.role || "default"]?.map((item, index) => (
            <NavigationMenuItem key={index}>
              <Button onClick={() => navigate(item.href)} variant="link">
                <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                  {item.title}
                </NavigationMenuLink>
              </Button>
            </NavigationMenuItem>
          ))}
        </NavigationMenuList>
      </NavigationMenu>
      <div className="flex flex-row items-center gap-3 mx-4">
        <LocaleSwitch />
        <ThemeSwitch />
        <SignInButton />
      </div>
    </div>
  );
}
