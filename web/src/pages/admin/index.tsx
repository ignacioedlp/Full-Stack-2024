import { NavBar } from "@/components/navbar";
import SideBar from "@/components/sidebar";
import Typography from "@/components/typography";
import { useTranslation } from "react-i18next";

const Index = () => {
  const { t } = useTranslation();
  return (
    <>
      <NavBar />
      <div className="flex flex-col mx-10 mt-10 space-y-8 lg:flex-row lg:space-x-12 lg:space-y-0">
        <SideBar />
        <div className="container mx-auto">
          <Typography variant="h3" text={t("dashboard.title")} />
          <Typography variant="p" text={t("dashboard.subtitle")} />
        </div>
      </div>
    </>
  );
};

export default Index;
