import { Button } from "./ui/button";
import { useSidebar } from "../contexts/sidebar-admin-provider";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

const SideBar = () => {
  const navigate = useNavigate();
  const { currentPage, handlePageChange } = useSidebar();
  const { t } = useTranslation();

  const items = [
    {
      id: "dashboard",
      name: t("sidebarAdmin.dashboard"),
      url: "/admin",
    },
    {
      id: "users",
      name: t("sidebarAdmin.users"),
      url: "/admin/users",
    },
    {
      id: "roles",
      name: t("sidebarAdmin.roles"),
      url: "/admin/roles",
    },
    {
      id: "audits",
      name: t("sidebarAdmin.audits"),
      url: "/admin/audits",
    },
    {
      id: "blocked",
      name: t("sidebarAdmin.blocked"),
      url: "/admin/blockedIps",
    },
    {
      id: "notifications",
      name: t("sidebarAdmin.notifications"),
      url: "/admin/notifications",
    },
  ];

  return (
    <div className="lg:w-1/5">
      <div className="flex space-x-2 lg:flex-col lg:space-x-0 lg:space-y-1">
        {items.map((item) => (
          <Button
            key={item.id}
            onClick={() => {
              handlePageChange(item.id);
              navigate(item.url);
            }}
            className="justify-start"
            variant={currentPage === item.id ? "default" : "link"}
          >
            {item.name}
          </Button>
        ))}
      </div>
    </div>
  );
};

export default SideBar;
