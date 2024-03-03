import { Button } from "@/components/ui/button";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import ThemeSwitch from "@/components/theme-switch";
import { useState } from "react";
import { EyeClosedIcon, EyeOpenIcon } from "@radix-ui/react-icons";
import api from "@/lib/api";
import { toast } from "sonner";
import { useAuth } from "@/contexts/auth-provider";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import LocaleSwitch from "@/components/locale-switch";
import Typography from "@/components/typography";

const SignInPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const { setToken, setUser } = useAuth();
  const navigate = useNavigate();
  const { t } = useTranslation();

  async function handleSubmit(credentials: {
    email: string;
    password: string;
  }) {
    const res = await api.auth.login({
      data: credentials,
    }).request;

    if (res.status === 401) {
      toast.error(t("toast.error.login"));
      return;
    }

    toast.success(t("toast.success.login"));

    const { data } = res.data;

    setToken(data.backendTokens, data.user);
    setUser(data.user);
    navigate("/home");
  }

  const formSchema = z.object({
    email: z.string().email(),
    password: z.string().min(8),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  // 2. Define a submit handler.
  function onSubmit(values: z.infer<typeof formSchema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    handleSubmit(values);
  }

  return (
    <section>
      <div
        style={{ position: "absolute", top: "1rem", right: "1rem" }}
        className="space-x-2"
      >
        <ThemeSwitch />
        <LocaleSwitch />
      </div>
      <div className="items-center justify-center lg:flex lg:min-h-screen">
        <main className="flex items-center justify-center px-8 py-8 sm:px-12 lg:col-span-7 lg:px-16 lg:py-12 xl:col-span-6">
          <div className="max-w-xl lg:max-w-3xl">
            <Typography variant="h1" text={t("login.title")} />

            <Typography
              variant="h3"
              text={t("login.subtitle")}
              className="my-4"
            />

            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-8"
              >
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel> {t("login.email")}</FormLabel>
                      <FormControl>
                        <Input placeholder="test@gmail.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel> {t("login.password")}</FormLabel>
                      <FormControl>
                        <div className="flex">
                          <Input
                            type={showPassword ? "text" : "password"}
                            {...field}
                          />
                          <Button
                            onClick={() => setShowPassword(!showPassword)}
                            type="button"
                            variant="ghost"
                          >
                            {showPassword ? <EyeOpenIcon /> : <EyeClosedIcon />}
                          </Button>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="flex flex-col justify-between w-full space-y-4">
                  <div className="flex space-x-2">
                    <Button type="submit"> {t("login.loginButton")}</Button>
                    <Button
                      type="button"
                      variant="secondary"
                      onClick={() => navigate("/signup")}
                    >
                      {t("login.signupButton")}
                    </Button>
                  </div>
                  <div className="flex space-x-2">
                    <a
                      href="/forgot-password"
                      className="leading-7 [&:not(:first-child)]:mt-6"
                    >
                      {" "}
                      {t("login.forgotPassword")}
                    </a>
                  </div>
                </div>
              </form>
            </Form>
          </div>
        </main>
      </div>
    </section>
  );
};

export default SignInPage;
