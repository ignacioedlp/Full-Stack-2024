import * as Device from "expo-device";
import * as Notifications from "expo-notifications";
import React, { useState, useEffect } from "react";
import { View, Switch, Platform, Alert } from "react-native";

import Typography from "./typography";

import { useAuth } from "@/contexts/auth-provider";
import { useLocalization } from "@/contexts/locale-provider";
import api from "@/libs/api";

const NotificationSwitch = () => {
  const [isEnabled, setIsEnabled] = useState(false);
  const { backendTokens } = useAuth();
  const { t } = useLocalization();

  useEffect(() => {
    checkNotificationStatus();
  }, []);

  const checkNotificationStatus = async () => {
    const { status } = await Notifications.getPermissionsAsync();
    setIsEnabled(status === "granted");
  };

  const toggleSwitch = () => {
    if (isEnabled) {
      setIsEnabled(false);
    } else {
      registerForPushNotificationsAsync().then((token) => {
        if (token) {
          setIsEnabled(true);
        } else {
          setIsEnabled(false);
        }
      });
    }
  };

  async function registerForPushNotificationsAsync() {
    let tokenExpo;
    let tokenFCM;
    if (Platform.OS === "android") {
      await Notifications.setNotificationChannelAsync("default", {
        name: "default",
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: "#FF231F7C",
      });
    }

    if (Device.isDevice) {
      const { status: existingStatus } =
        await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;
      if (existingStatus !== "granted") {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }
      if (finalStatus !== "granted") {
        Alert.alert("Failed to get push token for push notification!");
        return null;
      }
      tokenExpo = (
        await Notifications.getExpoPushTokenAsync({
          projectId: "8cb39e94-b17d-4b6d-9ad5-2f15aeadd7b6",
        })
      ).data;
      tokenFCM = (await Notifications.getDevicePushTokenAsync()).data;

      await api.profile.setNotificationToken({
        userAuthToken: backendTokens?.accessToken,
        token: tokenExpo,
      }).request;
    } else {
      Alert.alert("Must use physical device for Push Notifications");
      return null;
    }

    return tokenFCM;
  }

  return (
    <View className="flex flex-row items-center justify-between w-full">
      <Typography variant="h4" text={t("settings.notifications")} />
      <Switch
        trackColor={{ false: "#767577", true: "#959595" }}
        thumbColor={isEnabled ? "#000000" : "#f4f3f4"}
        ios_backgroundColor="#959595"
        onValueChange={toggleSwitch}
        value={isEnabled}
      />
    </View>
  );
};

export default NotificationSwitch;
