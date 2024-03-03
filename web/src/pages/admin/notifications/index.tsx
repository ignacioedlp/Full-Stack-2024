/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from "react";
import api from "@/lib/api";
import SideBar from "@/components/sidebar";
import { useAuth } from "@/contexts/auth-provider";
import { NavBar } from "@/components/navbar";
import { toast } from "sonner";
import Typography from "@/components/typography";
import { useTranslation } from "react-i18next";
import Select from "react-select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

const Page = () => {
  const { backendTokens } = useAuth();
  const [users, setUsers] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const { t } = useTranslation();

  async function sendNotifications() {
    if (backendTokens) {
      try {
        await api.notifications.sendNotifications({
          userAuthToken: backendTokens.accessToken,
          data: {
            title: title,
            description: description,
            tokens: selectedUsers.map((user) => user),
          },
        }).request;
      } catch (error: any) {
        toast.error(error?.response?.data.message);
      }
    } else {
      return [];
    }
  }

  const handleChange = (selectedOptions: any) => {
    setSelectedUsers(selectedOptions.map((user: { value: any }) => user.value));
  };

  useEffect(() => {
    async function getData() {
      if (backendTokens) {
        try {
          const response = await api.users.getAllUsers({
            userAuthToken: backendTokens.accessToken,
          }).request;

          const formatUsers = response.data.map(
            (user: { notification_token: any; username: any }) => {
              return {
                value: user.notification_token,
                label: user.username,
              };
            }
          );

          setUsers(formatUsers);
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
          <Typography variant="h3" text={t("notifications.title")} />
          <Typography variant="p" text={t("notifications.subtitle")} />
          <div className="flex flex-col space-y-4">
            <Select
              isMulti
              name="opciones"
              options={users}
              className="basic-multi-select"
              classNamePrefix="select"
              onChange={handleChange}
            />
            <div className="grid w-full max-w-sm items-center gap-1.5">
              <Label htmlFor="title">Title</Label>
              <Input
                type="text"
                id="title"
                placeholder="Title"
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>
            <div className="grid w-full max-w-sm items-center gap-1.5">
              <Label htmlFor="description">Description</Label>
              <Input
                type="text"
                id="description"
                placeholder="Description"
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>
            <Button type="button" onClick={sendNotifications}>
              Send
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Page;
