import React from "react";

import ThemeView from "@/components/screen";
import Typography from "@/components/typography";
import { useLocalization } from "@/contexts/locale-provider";

const Home = () => {
  const { t } = useLocalization();
  return (
    <ThemeView>
      <Typography variant="h1" text={t("home.title")} />
    </ThemeView>
  );
};

export default Home;
