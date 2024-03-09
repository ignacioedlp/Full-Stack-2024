import * as Localization from "expo-localization";
import { I18n } from "i18n-js";

import en from "@/locale/en.json";
import es from "@/locale/es.json";

const i18n = new I18n();

i18n.translations = { en, es };
i18n.locale = Localization.locale;
i18n.enableFallback = true;

export default i18n;
