/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from "react";
import { Role, columns } from "@/components/table/roles/columns";
import { DataTable } from "@/components/table/roles/data-table";
import api from "@/lib/api";
import SideBar from "@/components/sidebar";
import { useAuth } from "@/contexts/auth-provider";
import { NavBar } from "@/components/navbar";
import { toast } from "sonner";
import Typography from "@/components/typography";
import { useTranslation } from "react-i18next";

const Page = () => {
  const [roles, setRoles] = useState<Role[]>([]);
  const { backendTokens } = useAuth();
  const { t } = useTranslation();

  useEffect(() => {
    async function getData() {
      if (backendTokens) {
        try {
          const response = await api.roles.getRoles({
            userAuthToken: backendTokens.accessToken,
          }).request;

          const roles = response.data;

          setRoles(roles);
        } catch (error: any) {
          toast.error(error?.response?.data.message);
        }
      } else {
        return [];
      }
    }
    getData();
  }, [backendTokens]);

  return (
    <>
      <NavBar />
      <div className="flex flex-col mx-10 mt-10 space-y-8 lg:flex-row lg:space-x-12 lg:space-y-0">
        <SideBar />
        <div className="container mx-auto">
          <Typography variant="h3" text={t("roles.title")} />
          <Typography variant="p" text={t("roles.subtitle")} />
          <DataTable columns={columns} data={roles} />
        </div>
      </div>
    </>
  );
};

export default Page;
