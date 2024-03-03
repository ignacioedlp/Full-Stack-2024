/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from "react";
import { BlockedIp, columns } from "@/components/table/blocked-ips/columns";
import { DataTable } from "@/components/table/blocked-ips/data-table";
import api from "@/lib/api";
import SideBar from "@/components/sidebar";
import { useAuth } from "@/contexts/auth-provider";
import { NavBar } from "@/components/navbar";
import { toast } from "sonner";
import Typography from "@/components/typography";
import { useTranslation } from "react-i18next";

const Page = () => {
  const [blockedIps, setBlockedIps] = useState<BlockedIp[]>([]);
  const { backendTokens } = useAuth();
  const { t } = useTranslation();

  useEffect(() => {
    async function getData() {
      if (backendTokens) {
        try {
          const response = await api.blockedIps.getBlockedIps({
            userAuthToken: backendTokens.accessToken,
          }).request;

          const blocked = response.data;

          setBlockedIps(blocked);
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
          <Typography variant="h3" text={t("blockedIps.title")} />
          <Typography variant="p" text={t("blockedIps.subtitle")} />
          <DataTable columns={columns} data={blockedIps} />
        </div>
      </div>
    </>
  );
};

export default Page;
