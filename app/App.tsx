import { NavigationContainer } from "@react-navigation/native";
import * as Notifications from "expo-notifications";
import React, { useEffect, useState, useRef } from "react";
import "react-native-gesture-handler";
import "react-native-reanimated";
import Toast from "react-native-toast-message";

import { toastConfig } from "@/components/toast-config";
import { AuthProvider } from "@/contexts/auth-provider";
import { LocalizationProvider } from "@/contexts/locale-provider";
import Root from "@/routes/root";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

export default function App() {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [notification, setNotification] =
    useState<Notifications.Notification | null>(null);
  const notificationListener = useRef<Notifications.Subscription | null>(null);
  const responseListener = useRef<Notifications.Subscription | null>(null);

  useEffect(() => {
    notificationListener.current =
      Notifications.addNotificationReceivedListener((n) => {
        setNotification(n);
      });

    responseListener.current =
      Notifications.addNotificationResponseReceivedListener((response) => {
        console.log(response);
      });

    return () => {
      Notifications.removeNotificationSubscription(
        notificationListener.current!,
      );
      Notifications.removeNotificationSubscription(responseListener.current!);
    };
  }, []);

  return (
    <LocalizationProvider>
      <NavigationContainer>
        <AuthProvider>
          <Root />
          <Toast topOffset={60} config={toastConfig} />
        </AuthProvider>
      </NavigationContainer>
    </LocalizationProvider>
  );
}
