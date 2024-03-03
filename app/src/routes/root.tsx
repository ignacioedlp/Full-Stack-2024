import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

//Hooks
import { useAuth } from '@/contexts/auth-provider';

// Auth Screens
import LoginScreen from '@/screens/auth/login';
import ForgotPasswordScreen from '@/screens/auth/forgot-password';
import { TabNavigator } from './tabs';
import SignUpScreen from '@/screens/auth/sign-up';

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
