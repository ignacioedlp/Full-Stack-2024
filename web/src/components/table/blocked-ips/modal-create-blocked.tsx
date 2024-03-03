import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import api from "../../../lib/api";
import { toast } from "sonner";
import { useAuth } from "@/contexts/auth-provider";
import { useTranslation } from "react-i18next";
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

const formSchema = z.object({
  ip: z.string(),
  reason: z.string(),
});

export function ModalCreateBlocked() {
  const { backendTokens } = useAuth();
  const { t } = useTranslation();

  async function handleCreateRole(values: z.infer<typeof formSchema>) {
    try {
      if (backendTokens) {
        const response = await api.blockedIps.blockIp({
          userAuthToken: backendTokens.accessToken,
          data: values,
        }).request;

        if (response.status == 401) {
          toast.error(t("toast.unauthorize"));
          return null;
        }

        toast.info("Blocked successfully");
        window.location.reload();
      }
    } catch (error) {
      toast.error(t("toast.error.blockedIp"));
    }
  }

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      ip: "",
      reason: "",
    },
  });

  // 2. Define a submit handler.
  function onSubmit(values: z.infer<typeof formSchema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    handleCreateRole(values);
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">{t("blockedIp.buttonOpenModal")}</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="ip"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("blockedIp.ip")}</FormLabel>
                  <FormControl>
                    <Input placeholder="test" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="reason"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("blockedIp.reason")}</FormLabel>
                  <FormControl>
                    <Input placeholder="test" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit">{t("blockedIp.blockedButton")}</Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
