import React, { useState } from 'react';
import { View, TextInput, Alert } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import ThemeView from '@/components/screen';
import Typography from '@/components/typography';
import ThemeButton from '@/components/button';
import { useNavigation } from '@react-navigation/native';
import ThemeSecondaryButton from '@/components/secondary-button';
import ModalOtp from '@/components/modal-otp';
import api from '@/libs/api';

const SignUpScreen: React.FC = () => {
  const navigation = useNavigation();
  const [activationToken, setActivationToken] = useState('');

  const { control, handleSubmit } = useForm({
    defaultValues: {
      email: '',
      password: '',
      lastname: '',
      name: '',
      password_confirmation: '',
      username: '',
    },
  });
  const onSubmit = async (data) => {
    const response = await api.auth.register({
      data: data,
    }).request;

    if (response.status === 201) {
      setActivationToken(response.data.activationToken);
    } else {
      Alert.alert('Error', 'Ocurrió un error al crear la cuenta');
    }
  };

  return (
    <ThemeView>
      <View className="flex-col justify-between w-full h-full pt-5">
        <View className="flex-col justify-between space-y-5">
          <Typography variant="h1" text="Crea tu cuenta!" />
          <View>
            <Controller
              control={control}
              rules={{
                maxLength: 100,
              }}
              render={({ field: { onChange, onBlur, value } }) => (
                <View>
                  <Typography variant="p" text="Name" />
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
                  <Typography variant="p" text="Lastname" />
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
                  <Typography variant="p" text="Username" />
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
          <View>
            <Controller
              control={control}
              rules={{
                maxLength: 100,
              }}
              render={({ field: { onChange, onBlur, value } }) => (
                <View>
                  <Typography variant="p" text="Repeat password" />
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
              name="password_confirmation"
            />
          </View>
        </View>
        <View className="space-y-4">
          <View>
            <ThemeButton
              onPress={handleSubmit(onSubmit)}
              text="Crear mi cuenta"
            />
          </View>
          <View>
            <ThemeSecondaryButton
              onPress={() => (navigation as any).navigate('Login')}
              text="Ya tengo una cuenta"
            />
          </View>
        </View>
      </View>
      <ModalOtp token={activationToken} visible={activationToken.length > 0} />
    </ThemeView>
  );
};

export default SignUpScreen;
