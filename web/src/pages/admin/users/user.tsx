/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import api from "@/lib/api";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { SkeletonProfile } from "../../profile";
import { useAuth } from "@/contexts/auth-provider";
import { useParams } from "react-router-dom";
import { NavBar } from "@/components/navbar";
import { useTranslation } from "react-i18next";
import Typography from "@/components/typography";

type Role = {
  id: string;
  name: string;
};

type User = {
  name: string;
  lastname: string;
  email: string;
  avatar: string | null;
  username: string;
  role?: Role;
  blocked: boolean;
};

const formSchema = z.object({
  lastname: z.string(),
  name: z.string(),
  email: z.string().email(),
  username: z.string(),
  role: z.string(),
});

const ProfilePage = () => {
  const [user, setUser] = useState<User | null>(null);
  const [roles, setRoles] = useState<Role[]>([]);
  const { backendTokens } = useAuth();
  const { id } = useParams();
  const { t } = useTranslation();

  async function getUsers() {
    if (backendTokens) {
      const response = await api.users.getUser({
        userAuthToken: backendTokens.accessToken,
        id: id!,
      }).request;
      const user = response.data;

      if (response.status !== 200) {
        toast.error(response?.data.message);
      } else {
        setUser(user);
      }

      const roles = await api.roles.getRoles({
        userAuthToken: backendTokens.accessToken,
      }).request;

      if (roles.status !== 200) {
        toast.error(response?.data.message);
      } else {
        setRoles(roles.data);
      }
    }
  }

  useEffect(() => {
    async function getData() {
      if (backendTokens) {
        const response = await api.users.getUser({
          userAuthToken: backendTokens.accessToken,
          id: id!,
        }).request;
        const user = response.data;

        if (response.status !== 200) {
          toast.error(response?.data.message);
        } else {
          setUser(user);
        }

        const roles = await api.roles.getRoles({
          userAuthToken: backendTokens.accessToken,
        }).request;

        if (roles.status !== 200) {
          toast.error(response?.data.message);
        } else {
          setRoles(roles.data);
        }
      }
    }
    getData();
  }, [backendTokens, id]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: user?.email,
      name: user?.name,
      lastname: user?.lastname,
      username: user?.username,
      role: user?.role?.name,
    },
  });

  useEffect(() => {
    form.setValue("email", user?.email ? user.email : "");
    form.setValue("name", user?.name ? user.name : "");
    form.setValue("lastname", user?.lastname ? user.lastname : "");
    form.setValue("username", user?.username ? user.username : "");
    form.setValue("role", user?.role?.name ? user.role.name : "");
  }, [user, form]);

  const updateUser = async (values: z.infer<typeof formSchema>) => {
    try {
      if (backendTokens) {
        const userDate = {
          name: values.name,
          lastname: values.lastname,
          email: values.email,
          username: values.username,
          role_id: roles.find((role) => role.name === values.role)?.id,
        };

        await api.users.updateUser({
          userAuthToken: backendTokens.accessToken!,
          id: id!,
          data: userDate,
        }).request;

        await getUsers();
        toast.success(t("toast.success.updateUser"));
      }
    } catch (error: any) {
      toast.error(error.response.data.message);
    }
  };

  const banUser = async (blocked: boolean) => {
    if (backendTokens) {
      const response = await api.users.blockUsers({
        userAuthToken: backendTokens.accessToken!,
        id: id!,
        data: {
          blocked: blocked,
        },
      }).request;

      if (response.status !== 201) {
        toast.error(response?.data.message);
      } else {
        await getUsers();
      }
    }
  };

  // 2. Define a submit handler.
  function onSubmit(values: z.infer<typeof formSchema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    updateUser(values);
  }

  return (
    <>
      <NavBar />
      {user ? (
        <div className="container py-10 mx-auto">
          <div className="flex flex-col items-center justify-center space-y-8">
            <div className="flex flex-col items-start justify-between w-full md:flex-row">
              <div className="flex flex-col items-start justify-center mt-4 space-y-2">
                <Typography
                  variant="h1"
                  text={`${user.name} ${user.lastname}`}
                />
                <Typography
                  variant="p"
                  text={`${t("user.email")}: ${user?.email}`}
                />
                <Typography
                  variant="p"
                  text={`${t("user.username")}: ${user?.username}`}
                />
                <Typography
                  variant="p"
                  text={`${t("user.role")}: ${
                    user?.role?.name ? user.role.name : "No role"
                  }`}
                />
              </div>
              <div className="flex flex-col items-center justify-center gap-4">
                <div className="flex items-center justify-center">
                  <Avatar className="w-56 h-56 ">
                    <AvatarImage
                      src={
                        user?.avatar
                          ? user?.avatar
                          : "https://github.com/shadcn.png"
                      }
                      alt="@shadcn"
                      className="w-56 h-56"
                    />
                    <AvatarFallback>CN</AvatarFallback>
                  </Avatar>
                </div>
                {user?.blocked ? (
                  <Button type="button" onClick={() => banUser(false)}>
                    {t("user.unbanUser")}
                  </Button>
                ) : (
                  <Button
                    type="button"
                    variant="destructive"
                    onClick={() => banUser(true)}
                  >
                    {t("user.banUser")}
                  </Button>
                )}
              </div>
            </div>
            <div className="flex flex-col justify-between w-full md:flex-row ">
              <div className="space-y-4">
                <Typography variant="h2" text={t("user.updateUser")} />
                <Form {...form}>
                  <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="space-y-4"
                  >
                    <div className="space-y-2">
                      <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>{t("user.email")}</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                      <div>
                        <FormField
                          control={form.control}
                          name="name"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>{t("user.name")}</FormLabel>
                              <FormControl>
                                <Input {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      <div>
                        <FormField
                          control={form.control}
                          name="lastname"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>{t("user.lastname")}</FormLabel>
                              <FormControl>
                                <Input {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </div>
                    <div>
                      <FormField
                        control={form.control}
                        name="username"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>{t("user.username")}</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <div>
                      {" "}
                      {roles && (
                        <FormField
                          control={form.control}
                          name="role"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>{t("user.role")}</FormLabel>
                              <Select
                                onValueChange={field.onChange}
                                defaultValue={user?.role?.name}
                              >
                                <SelectTrigger>
                                  <SelectValue>
                                    {field.value
                                      ? field.value
                                      : "Select a role"}
                                  </SelectValue>
                                </SelectTrigger>
                                <SelectContent>
                                  {roles.map((role) => (
                                    <SelectItem key={role.id} value={role.name}>
                                      {role.name}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>

                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      )}
                    </div>
                    <Button type="submit">{t("user.buttonUpdate")}</Button>
                  </form>
                </Form>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <SkeletonProfile />
      )}
    </>
  );
};

export default ProfilePage;
