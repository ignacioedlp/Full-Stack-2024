import { createStackNavigator } from "@react-navigation/stack";
import React from "react";

import Profile from "@/screens/profile/profile";
import Setting from "@/screens/profile/setting";

const Stack = createStackNavigator();

export function ProfileNavigator() {
  return (
    <Stack.Navigator
      initialRouteName="profile"
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="profile" component={Profile} />
      <Stack.Screen name="settings" component={Setting} />
    </Stack.Navigator>
  );
}
