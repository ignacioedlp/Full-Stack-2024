import React, { createContext, useContext, useState } from "react";

import i18n from "@/libs/i18n";

interface LocalizationContextProps {
  locale: string;
  setLocale: (locale: string) => void;
  t: (key: string, options?: any) => string;
}

const LocalizationContext = createContext<LocalizationContextProps>({
  locale: i18n.locale,
  setLocale: () => {},
  t: i18n.t,
});

export const LocalizationProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [locale, setLocale] = useState(i18n.locale);

  const handleSetLocale = (locale: string) => {
    i18n.locale = locale;

    setLocale(locale);
  };

  const t = (key: string, options?: any): string => i18n.t(key, options);

  return (
    <LocalizationContext.Provider
      value={{ locale, setLocale: handleSetLocale, t }}
    >
      {children}
    </LocalizationContext.Provider>
  );
};

export const useLocalization = () => useContext(LocalizationContext);
