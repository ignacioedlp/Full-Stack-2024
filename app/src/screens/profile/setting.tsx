import { MaterialIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import React from "react";
import { View, TouchableOpacity, Text } from "react-native";
import CountryFlag from "react-native-country-flag";

import NotificationSwitch from "@/components/notification-switch";
import ThemeView from "@/components/screen";
import Typography from "@/components/typography";
import { useAuth } from "@/contexts/auth-provider";
import { useLocalization } from "@/contexts/locale-provider";

const Setting = () => {
  const novigation = useNavigation();
  const { setLocale, t, locale } = useLocalization();
  const { logout } = useAuth();

  const handleLogout = async () => {
    await logout();
  };

  return (
    <ThemeView>
      <View className="space-y-8">
        <View className="flex flex-row items-center justify-between w-full">
          <TouchableOpacity onPress={() => novigation.goBack()}>
            <MaterialIcons color="#000" size={24} name="arrow-back-ios" />
          </TouchableOpacity>
          <Typography variant="h1" text={t("settings.title")} />
        </View>
        <View>
          <NotificationSwitch />
        </View>
        <View>
          <View className="flex flex-row items-center justify-between w-full">
            <Typography variant="h4" text={t("settings.changeLenguage")} />
            {locale.split("-")[0] === "en" ? (
              <TouchableOpacity onPress={() => setLocale("es")}>
                <CountryFlag isoCode="us" size={24} />
              </TouchableOpacity>
            ) : (
              <TouchableOpacity onPress={() => setLocale("en")}>
                <CountryFlag isoCode="es" size={24} />
              </TouchableOpacity>
            )}
          </View>
        </View>
        <View className="flex flex-row items-center justify-center w-full">
          <TouchableOpacity onPress={handleLogout}>
            <Text className="text-xl font-semibold tracking-tight text-red-800 scroll-m-20">
              {t("profile.logout")}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </ThemeView>
  );
};

export default Setting;
