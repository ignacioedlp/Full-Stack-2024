/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from "react";
import { User, columns } from "@/components/table/users/columns";
import { DataTable } from "@/components/table/users/data-table";
import { NavBar } from "@/components/navbar";
import SideBar from "@/components/sidebar";
import { useAuth } from "@/contexts/auth-provider";
import api from "@/lib/api";
import { toast } from "sonner";
import Typography from "@/components/typography";
import { useTranslation } from "react-i18next";

const Page = () => {
  const [users, setUsers] = useState<User[]>([]);
  const { backendTokens } = useAuth();
  const { t } = useTranslation();

  useEffect(() => {
    async function getData() {
      if (backendTokens) {
        const response = await api.users.getAllUsers({
          userAuthToken: backendTokens.accessToken,
        }).request;

        const users = await response.data;

        if (response.status !== 200) {
          toast.error(response?.data.message);
          return;
        }

        const usersClean = users.map((user: any) => {
          return {
            id: user.id,
            username: user.username,
            email: user.email,
            role: user.role.name,
            blocked: user.blocked,
          };
        });

        setUsers(usersClean);
      }
      return [];
    }
    getData();
  }, [backendTokens]);

  return (
    <>
      <NavBar />
      <div className="flex flex-col mx-10 mt-10 space-y-8 lg:flex-row lg:space-x-12 lg:space-y-0">
        <SideBar />
        <div className="container mx-auto">
          <Typography variant="h3" text={t("users.title")} />
          <Typography variant="p" text={t("users.subtitle")} />
          <DataTable columns={columns} data={users} />
        </div>
      </div>
    </>
  );
};

export default Page;
