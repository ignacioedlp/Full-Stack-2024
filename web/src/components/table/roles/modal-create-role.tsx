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
  name: z.string(),
});

export function ModalCreateRole() {
  const { backendTokens } = useAuth();
  const { t } = useTranslation();

  async function handleCreateRole(values: z.infer<typeof formSchema>) {
    try {
      if (backendTokens) {
        const response = await api.roles.createRole({
          userAuthToken: backendTokens.accessToken,
          data: {
            ...values,
            Permission: [],
          },
        }).request;

        if (response.status == 401) {
          toast.error(t("toast.unauthorize"));
          return null;
        }

        toast.info("Role created successfully");
        window.location.reload();
      }
    } catch (error) {
      toast.error(t("toast.error.createRole"));
    }
  }

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
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
        <Button variant="outline">{t("createRole.buttonOpenModal")}</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("createRole.name")}</FormLabel>
                  <FormControl>
                    <Input placeholder="test" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit">{t("createRole.createButton")}</Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
