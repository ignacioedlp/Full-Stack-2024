import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import ThemeView from '@/components/screen';
import Typography from '@/components/typography';
import NotificationSwitch from '@/components/notification-switch';
import { useNavigation } from '@react-navigation/native';
import { MaterialIcons } from '@expo/vector-icons';

const Setting = () => {
  const novigation = useNavigation();
  return (
    <ThemeView>
      <View className="space-y-8">
        <View className="flex flex-row items-center justify-between w-full">
          <TouchableOpacity onPress={() => novigation.goBack()}>
            <MaterialIcons color="#000" size={24} name="arrow-back-ios" />
          </TouchableOpacity>
          <Typography variant="h1" text="Settings" />
        </View>
        <View>
          <NotificationSwitch />
        </View>
      </View>
    </ThemeView>
  );
};

export default Setting;
