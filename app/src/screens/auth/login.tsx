import { useNavigation } from "@react-navigation/native";
import React from "react";
import { useForm, Controller } from "react-hook-form";
import { View, TextInput, TouchableOpacity } from "react-native";

import ThemeButton from "@/components/button";
import ThemeView from "@/components/screen";
import ThemeSecondaryButton from "@/components/button-secondary";
import Typography from "@/components/typography";
import { useAuth } from "@/contexts/auth-provider";
import { useLocalization } from "@/contexts/locale-provider";

const LoginScreen: React.FC = () => {
  const { loginWithApi } = useAuth();
  const navigation = useNavigation();
  const { t } = useLocalization();

  const { control, handleSubmit } = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
  });
  const onSubmit = async (data) => {
    await loginWithApi(data);
  };

  return (
    <ThemeView>
      <View className="flex-col justify-between w-full h-full pt-10">
        <View className="flex-col justify-between space-y-5">
          <Typography variant="h1" text={t("login.title")} />
          <View>
            <Controller
              control={control}
              rules={{
                required: true,
              }}
              render={({ field: { onChange, onBlur, value } }) => (
                <View>
                  <Typography variant="p" text={t("field.email")} />
                  <TextInput
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                    placeholder="Email"
                    onBlur={onBlur}
                    onChangeText={onChange}
                    value={value}
                  />
                </View>
              )}
              name="email"
            />
          </View>
          <View>
            <Controller
              control={control}
              rules={{
                maxLength: 100,
              }}
              render={({ field: { onChange, onBlur, value } }) => (
                <View>
                  <Typography variant="p" text={t("field.password")} />
                  <TextInput
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                    placeholder="Password"
                    onBlur={onBlur}
                    onChangeText={onChange}
                    value={value}
                    secureTextEntry
                  />
                </View>
              )}
              name="password"
            />
          </View>
          <TouchableOpacity
            className="flex items-end w-full"
            onPress={() => (navigation as any).navigate("ForgotPassword")}
          >
            <Typography variant="p" text={t("login.forgotPassword")} />
          </TouchableOpacity>
        </View>
        <View className="space-y-4">
          <View>
            <ThemeButton
              onPress={handleSubmit(onSubmit)}
              text={t("login.login")}
            />
          </View>
          <View>
            <ThemeSecondaryButton
              onPress={() => (navigation as any).navigate("SignUp")}
              text={t("login.signUp")}
            />
          </View>
        </View>
      </View>
    </ThemeView>
  );
};

export default LoginScreen;
