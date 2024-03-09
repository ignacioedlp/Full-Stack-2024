import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import * as LocalAuthentication from "expo-local-authentication";
import React, { createContext, useContext, useEffect, useState } from "react";

import api from "@/libs/api";
import { AuthContextType, LoginData, LoginResponse, User } from "@/libs/types";

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const navigation = useNavigation();
  const [backendTokens, setBackendTokens] = useState<
    LoginResponse["data"]["backendTokens"] | null
  >(null);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [isBiometricSupported, setIsBiometricSupported] = useState(false);

  const loginWithApi = async (userData: LoginData) => {
    const response = await api.auth.login({
      data: userData,
    }).request;

    setUser(response.data.data.user);
    setBackendTokens(response.data.data.backendTokens);
    await AsyncStorage.setItem(
      "userData",
      JSON.stringify(response.data.data.user),
    );
    await AsyncStorage.setItem(
      "backendTokens",
      JSON.stringify(response.data.data.backendTokens),
    );
  };

  const logout = async () => {
    setUser(null);
    setBackendTokens(null);
    await AsyncStorage.removeItem("userData");
    await AsyncStorage.removeItem("backendTokens");
    (navigation as any).navigate("Login");
  };

  const checkAuth = async () => {
    const userDataString = await AsyncStorage.getItem("userData");
    if (userDataString) {
      const auth = LocalAuthentication.authenticateAsync({
        promptMessage: "Iniciar sesión con biometría",
      });

      auth.then(async (response) => {
        if (response.success) {
          const userData: User = JSON.parse(userDataString);
          const backendTokensData = await AsyncStorage.getItem("backendTokens");
          setUser(userData);
          setBackendTokens(JSON.parse(backendTokensData!));
        }
      });
    }
  };

  const checkBiometric = async () => {
    const supported = await LocalAuthentication.hasHardwareAsync();
    setIsBiometricSupported(supported);
  };

  // Check if token is valid
  useEffect(() => {
    const verify = async () => {
      if (backendTokens) {
        try {
          if (backendTokens.expiresIn < Date.now()) {
            logout();
          }
        } catch (error) {
          console.error("Error verifying token:", error);
          logout();
        }
      }
    };
    verify();
  }, [backendTokens]);

  useEffect(() => {
    checkBiometric();
    checkAuth();
  }, []);

  return (
    <AuthContext.Provider value={{ user, loginWithApi, logout, backendTokens }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth debe ser utilizado dentro de un AuthProvider");
  }
  return context;
};
