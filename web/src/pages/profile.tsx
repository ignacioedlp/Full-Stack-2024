import { UserAvatar } from "@/components/user-avatar";
import { Input } from "@/components/ui/input";
import { useState, useEffect } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { ModalUploadImage } from "@/components/profile/modal-upload-image";
import api from "@/lib/api";
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
import { toast } from "sonner";
import { NavBar } from "@/components/navbar";
import { useAuth } from "@/contexts/auth-provider";
import { useTranslation } from "react-i18next";
import Typography from "@/components/typography";
import { User } from "@/lib/types";

const formSchema = z.object({
  lastname: z.string(),
  name: z.string(),
  email: z.string().email(),
  username: z.string(),
});

const ProfilePage = () => {
  const [user, setUser] = useState<User | null>(null);
  const { backendTokens } = useAuth();
  const { t } = useTranslation();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: user?.email,
      name: user?.name,
      lastname: user?.lastname,
      username: user?.username,
    },
  });

  const handleUpdateProfile = async (values: z.infer<typeof formSchema>) => {
    try {
      if (backendTokens) {
        const response = await api.profile.updateProfile({
          userAuthToken: backendTokens.accessToken,
          data: values,
        }).request;

        if (response.status !== 200) {
          toast.error(t("toast.errorServer"));
        } else {
          const user = response.data;
          setUser(user);
          toast.success(t("toast.success.updateProfile"));
        }
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      toast.error(error.response.data.message);
    }
  };

  useEffect(() => {
    const getData = async () => {
      if (backendTokens) {
        const response = await api.profile.getProfile({
          userAuthToken: backendTokens.accessToken,
        }).request;

        if (response.status !== 200) {
          toast.error(t("toast.errorServer"));
        } else {
          const user = response.data;
          setUser(user);
        }
      }
    };

    getData();
  }, [backendTokens, t]);

  useEffect(() => {
    form.setValue("email", user?.email ? user.email : "");
    form.setValue("name", user?.name ? user.name : "");
    form.setValue("lastname", user?.lastname ? user.lastname : "");
    form.setValue("username", user?.username ? user.username : "");
  }, [user, form]);

  // 2. Define a submit handler.
  function onSubmit(values: z.infer<typeof formSchema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    handleUpdateProfile(values);
  }

  return user ? (
    <>
      <NavBar />
      <div className="flex flex-col items-center justify-center w-full h-screen ">
        <div className="flex items-center space-x-6">
          <div className="flex items-center justify-center p-3 border border-gray-200 rounded-full dark:border-gray-800">
            <UserAvatar avatar={user.avatar} />
          </div>
          <div className="space-y-1">
            <Typography variant="h1" text={`${user.name} ${user.lastname}`} />
            <ModalUploadImage />
          </div>
        </div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("profile.email")}</FormLabel>
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
                      <FormLabel>{t("profile.name")}</FormLabel>
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
                      <FormLabel>{t("profile.lastname")}</FormLabel>
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
                    <FormLabel>{t("profile.username")}</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <Button type="submit">{t("profile.buttonUpdate")}</Button>
          </form>
        </Form>
      </div>
    </>
  ) : (
    <SkeletonProfile />
  );
};

export const SkeletonProfile = () => {
  return (
    <div className="flex flex-col items-center justify-center w-full h-screen space-y-5">
      <div className="flex items-center space-x-4">
        <Skeleton className="w-12 h-12 rounded-full" />
        <div className="space-y-2">
          <Skeleton className="h-4 w-[250px]" />
          <Skeleton className="h-4 w-[200px]" />
        </div>
      </div>
      <div className="flex flex-col space-y-3">
        <div className="space-y-2">
          <Skeleton className="h-4 w-[250px]" />
          <Skeleton className="h-4 w-[200px]" />
        </div>
      </div>
      <div className="flex space-x-3">
        <div className="flex flex-col space-y-3">
          <div className="space-y-2">
            <Skeleton className="h-4 w-[250px]" />
            <Skeleton className="h-4 w-[200px]" />
          </div>
        </div>
        <div className="flex flex-col space-y-3">
          <div className="space-y-2">
            <Skeleton className="h-4 w-[250px]" />
            <Skeleton className="h-4 w-[200px]" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
