import React from 'react';
import { useAuth } from '@/contexts/auth-provider';
import { View, TextInput, TouchableOpacity } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import ThemeView from '@/components/screen';
import Typography from '@/components/typography';
import ThemeButton from '@/components/button';
import ThemeSecondaryButton from '@/components/secondary-button';
import { useNavigation } from '@react-navigation/native';

const LoginScreen: React.FC = () => {
  const { loginWithApi } = useAuth();
  const navigation = useNavigation();

  const { control, handleSubmit } = useForm({
    defaultValues: {
      email: '',
      password: '',
    },
  });
  const onSubmit = async (data) => {
    await loginWithApi(data);
  };

  return (
    <ThemeView>
      <View className="flex-col justify-between w-full h-full pt-10">
        <View className="flex-col justify-between space-y-5">
          <Typography variant="h1" text="Bienvenido!" />
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
          <View>
            <Controller
              control={control}
              rules={{
                maxLength: 100,
              }}
              render={({ field: { onChange, onBlur, value } }) => (
                <View>
                  <Typography variant="p" text="Password" />
                  <TextInput
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                    placeholder="Password"
                    onBlur={onBlur}
                    onChangeText={onChange}
                    value={value}
                    secureTextEntry={true}
                  />
                </View>
              )}
              name="password"
            />
          </View>
          <TouchableOpacity
            className="flex items-end w-full"
            onPress={() => (navigation as any).navigate('ForgotPassword')}
          >
            <Typography variant="p" text="Forgot Password?" />
          </TouchableOpacity>
        </View>
        <View className="space-y-4">
          <View>
            <ThemeButton onPress={handleSubmit(onSubmit)} text="Login" />
          </View>
          <View>
            <ThemeSecondaryButton
              onPress={() => (navigation as any).navigate('SignUp')}
              text="Crear mi cuenta"
            />
          </View>
        </View>
      </View>
    </ThemeView>
  );
};

export default LoginScreen;
