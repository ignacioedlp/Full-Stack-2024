import { createStackNavigator } from "@react-navigation/stack";
import React from "react";

//Hooks
import { TabNavigator } from "./tabs";

import { useAuth } from "@/contexts/auth-provider";
// Auth Screens
import ForgotPasswordScreen from "@/screens/auth/forgot-password";
import LoginScreen from "@/screens/auth/login";
import SignUpScreen from "@/screens/auth/sign-up";

const Stack = createStackNavigator();

export default function Root() {
  const { user } = useAuth();

  return user ? (
    <TabNavigator />
  ) : (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
      <Stack.Screen name="SignUp" component={SignUpScreen} />
    </Stack.Navigator>
  );
}
