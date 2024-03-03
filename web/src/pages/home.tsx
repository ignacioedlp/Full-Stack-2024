import { NavBar } from "@/components/navbar";
import Typography from "@/components/typography";
import { useTranslation } from "react-i18next";

const Home = () => {
  const { t } = useTranslation();
  return (
    <>
      <NavBar />
      <div className="container py-10 mx-auto space-y-5">
        <Typography variant="h3" text={t("home.title")} />
      </div>
    </>
  );
};

export default Home;
