/* eslint-disable react/no-unstable-nested-components */
import { Ionicons, FontAwesome } from "@expo/vector-icons";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import React from "react";
import { Text, Platform } from "react-native";

import { ProfileNavigator, HomeNavigator } from "./stacks";

import { useAuth } from "@/contexts/auth-provider";
import { useLocalization } from "@/contexts/locale-provider";

export const TabNavigator = () => {
  const { user } = useAuth();

  return <Tabs userTheme={user} />;
};

const BottomTab = createBottomTabNavigator();

const Tabs = ({ userTheme }) => {
  const { t } = useLocalization();
  return (
    <BottomTab.Navigator
      screenOptions={({ route }) => ({
        tabBarStyle: {
          position: "absolute",
          bottom: 0,
          right: 0,
          left: 0,
          shadowOffset: {
            width: 0,
            height: 12,
          },
          shadowOpacity: 0.58,
          shadowRadius: 16.0,
          elevation: 24,
          borderTopLeftRadius: 21,
          borderTopRightRadius: 21,
          backgroundColor: "#fff",
          width: "100%",
          height: Platform.OS === "android" ? 70 : 80,
          zIndex: 0,
          paddingBottom: Platform.OS === "android" ? 10 : 20,
          paddingTop: Platform.OS === "android" ? 10 : 20,
        },
        headerShown: false,
        tabBarActiveTintColor: "#000",
        tabBarIcon: (props) => {
          const iconName = "";
          switch (route.name) {
            case "profileTab":
              return (
                <FontAwesome
                  size={24}
                  name={props.focused ? "user" : "user-o"}
                  color={props.focused ? "#000" : "#000"}
                />
              );

            case "homeTab":
              return (
                <Ionicons
                  size={24}
                  color={props.focused ? "#000" : "#000"}
                  name={props.focused ? "home" : "home-outline"}
                />
              );
          }

          return <Text style={{ color: "#000" }}>{iconName}</Text>;
        },
      })}
    >
      <BottomTab.Screen
        initialParams={userTheme}
        name="homeTab"
        options={{ title: t("navbar.home") }}
        component={HomeNavigator}
      />
      <BottomTab.Screen
        initialParams={userTheme}
        name="profileTab"
        options={{ title: t("navbar.profile") }}
        component={ProfileNavigator}
      />
    </BottomTab.Navigator>
  );
};
