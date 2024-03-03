import { useState } from "react";
import { OtpModal } from "@/components/otp-modal";
import { toast } from "sonner";
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
import { Button } from "@/components/ui/button";
import ThemeSwitch from "@/components/theme-switch";
import api from "@/lib/api";
import { EyeClosedIcon, EyeOpenIcon } from "@radix-ui/react-icons";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import LocaleSwitch from "@/components/locale-switch";
import Typography from "@/components/typography";

const SignUpPage = () => {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [validationToken, setValidationToken] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const { t } = useTranslation();

  async function handleSubmit(credentials: {
    email: string;
    password: string;
    password_confirmation: string;
    name: string;
    lastname: string;
    username: string;
  }) {
    try {
      const res = await api.auth.register({
        data: credentials,
      }).request;

      if (res.status == 401) {
        toast.error(res.data.message);
        return null;
      }

      const user = await res.data;
      setOpen(true);
      setValidationToken(user.activationToken);
      toast.success(t("toast.success.preRegister"));
    } catch (error) {
      toast.error(t("toast.errorServer"));
    }
  }

  async function handleValidate(otp: string) {
    try {
      const res = await api.auth.activateAccount({
        data: { activationCode: otp },
        userAuthToken: validationToken,
      }).request;

      if (res.status == 401) {
        toast.error(res.data.message);
        return null;
      }

      toast.success(t("toast.success.register"));
      navigate("/login");
    } catch (error) {
      toast.error(t("toast.errorServer"));
    }
  }

  const formSchema = z.object({
    email: z.string().email(),
    password: z.string().min(8),
    password_confirmation: z.string().min(8),
    lastname: z.string(),
    name: z.string(),
    username: z.string(),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
      password_confirmation: "",
      name: "",
      lastname: "",
      username: "",
    },
  });

  // 2. Define a submit handler.
  function onSubmit(values: z.infer<typeof formSchema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    handleSubmit(values);
  }

  return (
    <div>
      <div
        style={{ position: "absolute", top: "1rem", right: "1rem" }}
        className="space-x-2"
      >
        <ThemeSwitch />
        <LocaleSwitch />
      </div>
      <OtpModal open={open} handleValidate={handleValidate} setOpen={setOpen} />
      <div className="items-center justify-center lg:flex lg:min-h-screen">
        <main className="flex items-center justify-center px-8 py-8 sm:px-12 lg:col-span-7 lg:px-16 lg:py-12 xl:col-span-6">
          <div className="max-w-xl lg:max-w-3xl">
            <Typography variant="h1" text={t("register.title")} />

            <Typography
              variant="h3"
              text={t("register.subtitle")}
              className="my-4"
            />

            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-6"
              >
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel> {t("register.email")}</FormLabel>
                      <FormControl>
                        <Input placeholder="test@gmail.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="username"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel> {t("register.username")}</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel> {t("register.name")}</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="lastname"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel> {t("register.lastname")}</FormLabel>
                      <FormControl>
                        <Input {...field} />
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
                      <FormLabel> {t("register.password")}</FormLabel>
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
                <FormField
                  control={form.control}
                  name="password_confirmation"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel> {t("register.confirmPassword")}</FormLabel>
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
                <div className="flex space-x-2">
                  <Button type="submit"> {t("register.registerButton")}</Button>
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={() => navigate("/login")}
                  >
                    {t("register.loginButton")}
                  </Button>
                </div>
              </form>
            </Form>
          </div>
        </main>
      </div>
    </div>
  );
};

export default SignUpPage;
