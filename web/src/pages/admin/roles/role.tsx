import React, { useState, useEffect } from "react";
import { NavBar } from "@/components/navbar";
import api from "@/lib/api";
import { useAuth } from "@/contexts/auth-provider";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";
import { Input } from "@/components/ui/input";
import { Cross1Icon, Pencil1Icon } from "@radix-ui/react-icons";
import Typography from "@/components/typography";

interface Permission {
  action: string;
  subject: string;
  conditions?: string;
}

interface Role {
  id: string;
  name: string;
  Permission: Permission[];
}

const ProfilePage: React.FC = () => {
  const [role, setRole] = useState<Role | null>(null);
  const [edit, setEdit] = useState<boolean>(false);
  const [roleName, setRoleName] = useState<string>("");
  const { backendTokens } = useAuth();
  const { id } = useParams();
  const { t } = useTranslation();
  const navigate = useNavigate();

  useEffect(() => {
    async function getData() {
      if (backendTokens) {
        try {
          const response = await api.roles.getRole({
            userAuthToken: backendTokens?.accessToken,
            id: id!,
          }).request;

          const roleData: Role = response.data;
          setRole(roleData);
          setRoleName(roleData.name);
        } catch (error: unknown) {
          toast.error(
            (error as { response: { data: { message: string } } }).response.data
              .message
          );
        }
      }
    }
    getData();
  }, [backendTokens, id]);

  const handlePermissionChange = (permission: Permission) => {
    const hasPermission = role!.Permission.some(
      (p) => p.action === permission.action && p.subject === permission.subject
    );

    if (hasPermission) {
      const newPermissions = role!.Permission.filter(
        (p) =>
          p.action !== permission.action || p.subject !== permission.subject
      );
      setRole({ ...role!, Permission: newPermissions });
    } else {
      setRole({
        ...role!,
        Permission: [...role!.Permission, permission],
      });
    }
  };

  const handleUpdateRole = async () => {
    const updatedRole = {
      id: role?.id,
      name: roleName,
      Permission: role?.Permission.map((permission) => {
        return {
          action: permission.action,
          subject: permission.subject,
          conditions: permission.conditions,
        };
      }),
    };

    if (backendTokens) {
      const response = await api.roles.updateRole({
        userAuthToken: backendTokens.accessToken,
        id: id!,
        data: updatedRole,
      }).request;

      if (response.status === 200) {
        toast.success(t("toast.success.updateRole"));
      } else {
        toast.error(response?.data.message);
      }
    }
  };

  const handleDeleteRole = async () => {
    if (backendTokens) {
      const response = await api.roles.deleteRole({
        userAuthToken: backendTokens.accessToken,
        id: id!,
      }).request;

      if (response.status === 200) {
        toast.success(t("toast.success.deleteRole"));
        navigate("/admin/roles");
      } else {
        toast.error(response?.data.message);
      }
    }
  };

  const permissions = [
    {
      subject: "User",
      title: t("role.user.title"),
      actions: [
        { title: t("role.user.read"), action: "read" },
        { title: t("role.user.update"), action: "update" },
        { title: t("role.user.delete"), action: "delete" },
      ],
    },
    {
      subject: "Role",
      title: t("role.role.title"),
      actions: [
        { title: t("role.role.read"), action: "read" },
        { title: t("role.role.create"), action: "create" },
        { title: t("role.role.update"), action: "update" },
        { title: t("role.role.delete"), action: "delete" },
      ],
    },
    {
      subject: "Task",
      title: t("role.task.title"),
      actions: [
        { title: t("role.task.read"), action: "read" },
        { title: t("role.task.create"), action: "create" },
        { title: t("role.task.update"), action: "update" },
        { title: t("role.task.delete"), action: "delete" },
        { title: t("role.task.manage"), action: "manage" },
      ],
    },
    {
      subject: "BlockedIp",
      title: t("role.blocked.title"),
      actions: [
        { title: t("role.blocked.read"), action: "read" },
        { title: t("role.blocked.create"), action: "create" },
        { title: t("role.blocked.delete"), action: "delete" },
      ],
    },
    {
      subject: "Audits",
      title: t("role.audits.title"),
      actions: [{ title: t("role.audits.read"), action: "read" }],
    },
    {
      subject: "Notification",
      title: t("role.notifications.title"),
      actions: [{ title: t("role.notifications.create"), action: "create" }],
    },
  ];

  return (
    <>
      <NavBar />
      <div className="container py-10 mx-auto space-y-5">
        {role && (
          <div className="flex flex-col space-y-4">
            <div className="flex items-center gap-4">
              {edit ? (
                <Input
                  value={roleName}
                  onChange={(e) => setRoleName(e.target.value)}
                />
              ) : (
                <Typography variant="h1" text={role.name} />
              )}
              {!edit ? (
                <Button
                  onClick={() => {
                    setEdit(true);
                  }}
                  variant="ghost"
                >
                  <Pencil1Icon className="w-4 h-4" />
                </Button>
              ) : (
                <Button
                  onClick={() => {
                    setEdit(false);
                    setRoleName(role.name);
                  }}
                  variant="ghost"
                >
                  <Cross1Icon className="w-4 h-4" />
                </Button>
              )}
            </div>
            <div className="flex flex-col space-y-4">
              <Typography variant="h2" text={t("role.subtitle")} />
              {permissions.map((permGroup) => (
                <div key={permGroup.subject} className="space-y-3">
                  <Typography variant="h3" text={permGroup.title} />
                  <div className="flex space-x-2">
                    {permGroup.actions.map((permission) => (
                      <div
                        key={permission.action}
                        className="flex items-center space-x-2"
                      >
                        <Checkbox
                          checked={role.Permission.some(
                            (p) =>
                              p.action === permission.action &&
                              p.subject === permGroup.subject
                          )}
                          onClick={() => {
                            handlePermissionChange({
                              action: permission.action,
                              subject: permGroup.subject,
                            });
                          }}
                        />
                        <span className="capitalize">{permission.title}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        <div className="flex items-center gap-4">
          <Button onClick={handleUpdateRole}>{t("role.buttonUpdate")}</Button>
          <Button onClick={handleDeleteRole} variant="destructive">
            {t("role.buttonDelete")}
          </Button>
        </div>
      </div>
    </>
  );
};

export default ProfilePage;
