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
import api from "../../lib/api";
import { useTranslation } from "react-i18next";
import LocaleSwitch from "@/components/locale-switch";
import Typography from "@/components/typography";

const formSchema = z.object({
  email: z.string().email(),
});

const ForgotPasswordPage = () => {
  const { t } = useTranslation();
  async function handleForgotPassword(email: string) {
    try {
      const response = await api.auth.forgotPassword({
        data: {
          email,
        },
      }).request;

      if (response.status == 401) {
        toast.error(t("toast.unauthorize"));
        return null;
      }

      toast.info(t("toast.success.forgotPassword"));
    } catch (error) {
      toast.error(t("toast.errorServer"));
    }
  }

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
    },
  });

  // 2. Define a submit handler.
  function onSubmit(values: z.infer<typeof formSchema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    handleForgotPassword(values.email);
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
            <Typography variant="h1" text={t("forgotPassword.title")} />

            <Typography
              variant="h3"
              text={t("forgotPassword.subtitle")}
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
                      <FormLabel>{t("forgotPassword.email")}</FormLabel>
                      <FormControl>
                        <Input placeholder="test@gmail.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit">{t("forgotPassword.sendButton")}</Button>
              </form>
            </Form>
          </div>
        </main>
      </div>
    </section>
  );
};

export default ForgotPasswordPage;
