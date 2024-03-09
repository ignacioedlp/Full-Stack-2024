import React from "react";
import { useForm, Controller } from "react-hook-form";
import { View, TextInput } from "react-native";
import Toast from "react-native-toast-message";

import ThemeButton from "@/components/button";
import ThemeView from "@/components/screen";
import Typography from "@/components/typography";
import { useLocalization } from "@/contexts/locale-provider";
import api from "@/libs/api";

const ForgotPasswordScreen: React.FC = () => {
  const { t } = useLocalization();
  const { control, handleSubmit } = useForm({
    defaultValues: {
      email: "",
    },
  });
  const onSubmit = async (values) => {
    const response = await api.auth.forgotPassword({
      data: values,
    }).request;

    if (response.status === 201) {
      Toast.show({
        type: "success",
        text1: t("toast.success.forgotPassword"),
      });
    } else {
      Toast.show({
        type: "error",
        text1: t("toast.error.forgotPassword"),
      });
    }
  };

  return (
    <ThemeView>
      <View className="flex-col justify-between w-full h-full pt-10">
        <View className="flex-col justify-between space-y-5">
          <Typography variant="h2" text={t("forgotPassword.title")} />
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
        </View>
        <View>
          <ThemeButton
            onPress={handleSubmit(onSubmit)}
            text={t("forgotPassword.send")}
          />
        </View>
      </View>
    </ThemeView>
  );
};

export default ForgotPasswordScreen;
