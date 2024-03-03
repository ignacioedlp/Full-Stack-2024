/* eslint-disable @typescript-eslint/no-explicit-any */
import { NavBar } from "@/components/navbar";
import api from "@/lib/api";
import { useAuth } from "@/contexts/auth-provider";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";
import Typography from "@/components/typography";

type BlockedIp = {
  id: string;
  reason: string;
  ip: string;
  createdAt: string;
};

const BlockedIp = () => {
  const [blocked, setBlocked] = useState<BlockedIp | null>(null);
  const { backendTokens } = useAuth();
  const { id } = useParams();
  const { t } = useTranslation();
  const navigate = useNavigate();

  useEffect(() => {
    async function getData() {
      if (backendTokens) {
        try {
          const response = await api.blockedIps.getBlockedIP({
            userAuthToken: backendTokens?.accessToken,
            id: id!,
          }).request;

          const blocked = response.data;
          setBlocked(blocked);
        } catch (error: any) {
          toast.error(error?.response?.data.message);
        }
      }
    }
    getData();
  }, [backendTokens, id]);

  const handleUnblocked = async () => {
    if (backendTokens) {
      const response = await api.blockedIps.unblockIp({
        userAuthToken: backendTokens.accessToken,
        id: id!,
      }).request;

      if (response.status === 200) {
        toast.success(t("toast.success.unBlocked"));
        navigate("/admin/roles");
      } else {
        toast.error(response?.data.message);
      }
    }
  };

  return (
    <>
      <NavBar />
      <div className="container py-10 mx-auto space-y-5">
        {blocked && (
          <div className="flex flex-col items-center gap-4">
            <Typography variant="h1" text={blocked.ip} />
            <Typography variant="p" text={blocked.reason} />
            <Button
              onClick={() => {
                handleUnblocked();
              }}
              variant="destructive"
            >
              {t("blocked.buttonDelete")}
            </Button>
          </div>
        )}
      </div>
    </>
  );
};

export default BlockedIp;
