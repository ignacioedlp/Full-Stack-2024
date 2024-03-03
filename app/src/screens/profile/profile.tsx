import { useAuth } from '@/contexts/auth-provider';
import ThemeView from '@/components/screen';
import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import ThemeButton from '@/components/button';
import Typography from '@/components/typography';
import { MaterialIcons } from '@expo/vector-icons';

const Profile: React.FC = () => {
  const { logout } = useAuth();
  const navigation = useNavigation();

  const handleLogout = async () => {
    await logout();
  };

  return (
    <ThemeView>
      <View className="space-y-4 ">
        <View className="flex flex-row items-center justify-between w-full">
          <Typography variant="h1" text="Profile" />
          <TouchableOpacity onPress={handleLogout}>
            <MaterialIcons color="#FF0000" size={24} name="logout" />
          </TouchableOpacity>
        </View>
        <View>
          <ThemeButton
            text="Configuración"
            onPress={() => (navigation as any).navigate('settings')}
          />
        </View>
      </View>
    </ThemeView>
  );
};

export default Profile;
