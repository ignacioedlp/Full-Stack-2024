import { createStackNavigator } from "@react-navigation/stack";
import React from "react";

import Home from "@/screens/home";

const Stack = createStackNavigator();

export function HomeNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="news" component={Home} />
    </Stack.Navigator>
  );
}
