import { toast } from "sonner";
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
import ThemeSwitch from "@/components/theme-switch";
import api from "@/lib/api";
import { EyeClosedIcon, EyeOpenIcon } from "@radix-ui/react-icons";
import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import LocaleSwitch from "@/components/locale-switch";
import Typography from "@/components/typography";

const formSchema = z.object({
  password: z.string().min(8),
  passwordConfirmation: z.string().min(8),
});

const ForgotPasswordPage = () => {
  const [searchParams] = useSearchParams();
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const { t } = useTranslation();

  async function handleForgotPassword(values: z.infer<typeof formSchema>) {
    try {
      const token = searchParams.get("verify");
      if (token) {
        const response = await api.auth.resetPassword({
          userAuthToken: token,
          data: values,
        }).request;

        if (response.status == 401) {
          toast.error(t("toast.unauthorize"));
          return null;
        }

        toast.success(t("toast.success.resetPassword"));
        navigate("/login");
      } else {
        toast.error(t("toast.errorServer"));
      }
    } catch (error) {
      toast.error(t("toast.errorServer"));
    }
  }

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      password: "",
      passwordConfirmation: "",
    },
  });

  // 2. Define a submit handler.
  function onSubmit(values: z.infer<typeof formSchema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    handleForgotPassword(values);
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
            <Typography variant="h1" text={t("resetPassword.title")} />

            <Typography
              variant="h3"
              text={t("resetPassword.subtitle")}
              className="my-4"
            />

            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-8"
              >
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel> {t("resetPassword.password")}</FormLabel>
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
                  name="passwordConfirmation"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        {" "}
                        {t("resetPassword.confirmPassword")}
                      </FormLabel>
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
                <Button type="submit"> {t("resetPassword.resetButton")}</Button>
              </form>
            </Form>
          </div>
        </main>
      </div>
    </section>
  );
};

export default ForgotPasswordPage;
