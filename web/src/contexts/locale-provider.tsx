// locale provider (i18N)
import { createContext, useContext, useState } from "react";
import { useTranslation } from "react-i18next";

export const LocaleProvider = ({ children }: { children: React.ReactNode }) => {
  const { i18n } = useTranslation();
  const [locale, setLocale] = useState(i18n.language);

  const changeLocale = (newLocale: string) => {
    i18n.changeLanguage(newLocale);
    setLocale(newLocale);
  };

  return (
    <LocaleContext.Provider value={{ locale, changeLocale }}>
      {children}
    </LocaleContext.Provider>
  );
};

export const LocaleContext = createContext<{
  locale: string;
  changeLocale: (newLocale: string) => void;
}>({
  locale: "en",
  changeLocale: () => {},
});

export const useLocale = () => {
  const context = useContext(LocaleContext);
  if (!context) {
    throw new Error("useLocale must be used within a LocaleProvider");
  }
  return context;
};
