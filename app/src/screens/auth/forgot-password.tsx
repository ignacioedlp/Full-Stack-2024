import React from 'react';
import { View, TextInput, Alert } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import ThemeView from '@/components/screen';
import Typography from '@/components/typography';
import ThemeButton from '@/components/button';
import api from '@/libs/api';

const ForgotPasswordScreen: React.FC = () => {
  const { control, handleSubmit } = useForm({
    defaultValues: {
      email: '',
    },
  });
  const onSubmit = async (values) => {
    const response = await api.auth.forgotPassword({
      data: values,
    }).request;

    if (response.status === 201) {
      Alert.alert(
        'Email enviado',
        'Revisa tu correo para restablecer tu contraseña',
      );
    } else {
      Alert.alert('Error', 'Ocurrió un error al enviar el correo');
    }
  };

  return (
    <ThemeView>
      <View className="flex-col justify-between w-full h-full pt-10">
        <View className="flex-col justify-between space-y-5">
          <Typography variant="h2" text="Recuperar contraseña" />
          <View>
            <Controller
              control={control}
              rules={{
                required: true,
              }}
              render={({ field: { onChange, onBlur, value } }) => (
                <View>
                  <Typography variant="p" text="Email" />
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
          <ThemeButton onPress={handleSubmit(onSubmit)} text="Enviar correo" />
        </View>
      </View>
    </ThemeView>
  );
};

export default ForgotPasswordScreen;
