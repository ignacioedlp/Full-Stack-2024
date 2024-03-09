import { useNavigation } from "@react-navigation/native";
import React, { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { View, TextInput } from "react-native";
import Toast from "react-native-toast-message";

import ThemeButton from "@/components/button";
import ModalOtp from "@/components/modal-otp";
import ThemeView from "@/components/screen";
import ThemeSecondaryButton from "@/components/button-secondary";
import Typography from "@/components/typography";
import { useLocalization } from "@/contexts/locale-provider";
import api from "@/libs/api";

const SignUpScreen: React.FC = () => {
  const navigation = useNavigation();
  const [activationToken, setActivationToken] = useState("");
  const { t } = useLocalization();

  const { control, handleSubmit } = useForm({
    defaultValues: {
      email: "",
      password: "",
      lastname: "",
      name: "",
      password_confirmation: "",
      username: "",
    },
  });
  const onSubmit = async (data) => {
    const response = await api.auth.register({
      data,
    }).request;

    if (response.status === 201) {
      setActivationToken(response.data.activationToken);
    } else {
      Toast.show({
        type: "error",
        text1: t("toast.error.register"),
      });
    }
  };

  return (
    <ThemeView>
      <View className="flex-col justify-between w-full h-full pt-5">
        <View className="flex-col justify-between space-y-5">
          <Typography variant="h1" text={t("signUp.title")} />
          <View>
            <Controller
              control={control}
              rules={{
                maxLength: 100,
              }}
              render={({ field: { onChange, onBlur, value } }) => (
                <View>
                  <Typography variant="p" text={t("field.name")} />
                  <TextInput
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                    placeholder="Firstname"
                    onBlur={onBlur}
                    onChangeText={onChange}
                    value={value}
                  />
                </View>
              )}
              name="name"
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
                  <Typography variant="p" text={t("field.lastname")} />
                  <TextInput
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                    placeholder="Lastname"
                    onBlur={onBlur}
                    onChangeText={onChange}
                    value={value}
                  />
                </View>
              )}
              name="lastname"
            />
          </View>
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
                  <Typography variant="p" text={t("field.username")} />
                  <TextInput
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                    placeholder="Username"
                    onBlur={onBlur}
                    onChangeText={onChange}
                    value={value}
                  />
                </View>
              )}
              name="username"
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
          <View>
            <Controller
              control={control}
              rules={{
                maxLength: 100,
              }}
              render={({ field: { onChange, onBlur, value } }) => (
                <View>
                  <Typography variant="p" text={t("field.confirmPassword")} />
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
              name="password_confirmation"
            />
          </View>
        </View>
        <View className="space-y-4">
          <View>
            <ThemeButton
              onPress={handleSubmit(onSubmit)}
              text={t("signUp.signUp")}
            />
          </View>
          <View>
            <ThemeSecondaryButton
              onPress={() => (navigation as any).navigate("Login")}
              text={t("signUp.login")}
            />
          </View>
        </View>
      </View>
      <ModalOtp token={activationToken} visible={activationToken.length > 0} />
    </ThemeView>
  );
};

export default SignUpScreen;
