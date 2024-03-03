import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import api from "../../lib/api";
import { toast } from "sonner";
import { useAuth } from "@/contexts/auth-provider";
import { useTranslation } from "react-i18next";

export function ModalUploadImage() {
  const [file, setFile] = useState<File | null>(null);
  const { backendTokens } = useAuth();
  const { t } = useTranslation();

  const handleSubmit = async () => {
    try {
      if (!file) return;

      if (!backendTokens) return;

      const formData = new FormData();
      formData.append("file", file);

      const response = await api.profile.updateAvatar({
        userAuthToken: backendTokens.accessToken,
        data: formData,
      }).request;

      if (response.status === 200) {
        toast.success(t("toast.success.updateAvatar"));
        window.location.reload();
      }
    } catch (error: unknown) {
      toast.error(
        (error as { response: { data: { message: string } } }).response.data
          .message
      );
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button size="sm" variant="ghost">
          {t("profile.buttonUpdateAvatar")}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{t("profile.titleAvatar")}</DialogTitle>
          <DialogDescription>{t("profile.subtitleAvatar")}</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid items-center grid-cols-4 gap-4">
            <div className="col-span-1">
              <Label htmlFor="file">Avatar</Label>
            </div>
            <div className="col-span-3">
              <Input
                id="file"
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    setFile(file);
                  }
                }}
              />
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button type="button" onClick={handleSubmit}>
            {t("profile.buttonSaveAvatar")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
