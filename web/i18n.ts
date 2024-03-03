import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import enJSON from "./src/locale/en.json";
import esJSON from "./src/locale/es.json";
i18n.use(initReactI18next).init({
  resources: {
    en: { ...enJSON },
    es: { ...esJSON },
  },
  lng: "en",
});
