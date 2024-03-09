import { Camera } from "expo-camera";
import * as ImagePicker from "expo-image-picker";
import React, { useState } from "react";
import {
  StyleSheet,
  View,
  Modal,
  Dimensions,
  Platform,
  ActivityIndicator,
  TouchableWithoutFeedback,
} from "react-native";
import Toast from "react-native-toast-message";

import ThemeButton from "./button";
import Typography from "./typography";

import { useLocalization } from "@/contexts/locale-provider";
import api from "@/libs/api";

const getCameraPermissionAsync = async () => {
  if (Platform.OS !== "web") {
    const { status } = await Camera.requestCameraPermissionsAsync();
    if (status !== "granted") {
      alert("Lo siento, necesitamos permisos de cámara para hacer esto.");
    } else {
      return true;
    }
  }
};

const getLibraryPermissionsAsync = async () => {
  if (Platform.OS !== "web") {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      alert("Lo siento, necesitamos permisos de la galería para hacer esto.");
    } else {
      return true;
    }
  }
};

const ModalUploadPhoto = ({
  token,
  visible,
  setVisible,
}: {
  token: string;
  visible: boolean;
  setVisible: (value: boolean) => void;
}) => {
  const { t } = useLocalization();
  const [isLoading, setIsLoading] = useState(false);

  const pickImage = async () => {
    if (getLibraryPermissionsAsync()) {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 1,
      });

      if (!result.canceled) {
        handleUpload(result.assets[0]);
      }
    }
  };

  const takeImage = async () => {
    if (getCameraPermissionAsync()) {
      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 1,
      });

      if (!result.canceled) {
        handleUpload(result.assets[0]);
      }
    }
  };

  const handleUpload = async (image) => {
    try {
      setIsLoading(true);
      const formData = new FormData();
      // @ts-ignore
      formData.append("file", {
        uri: image.uri,
        type: "image/jpeg",
        name: "avatar.jpg",
      });

      const response = await api.profile.updateAvatar({
        userAuthToken: token,
        data: formData,
      }).request;

      setIsLoading(false);

      if (response.status === 200) {
        Toast.show({
          type: "success",
          text1: t("toast.success.updateAvatar"),
        });
        setVisible(false);
      }
    } catch {
      Toast.show({
        type: "error",
        text1: t("toast.error.updateAvatar"),
      });
      setIsLoading(false);
      setVisible(false);
    }
  };

  return (
    <Modal animationType="fade" transparent visible={visible}>
      <TouchableWithoutFeedback onPress={() => setVisible(false)}>
        <View style={styles.container}>
          <View
            className="flex flex-col items-center justify-between py-8 space-y-4"
            style={styles.modalStyle}
          >
            <View>
              <Typography variant="h4" text={t("profile.changePhoto")} />
            </View>
            {isLoading ? (
              <ActivityIndicator size="large" color="#000000" />
            ) : (
              <View className="w-full space-y-2">
                <View className="flex w-full space-x-3">
                  <ThemeButton
                    text={t("profile.takePhoto")}
                    onPress={takeImage}
                  />
                </View>
                <View className="flex w-full space-x-3">
                  <ThemeButton
                    text={t("profile.choosePhoto")}
                    onPress={pickImage}
                  />
                </View>
              </View>
            )}
          </View>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalStyle: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 25,
    width: Dimensions.get("window").width / 1.5,
  },
});

export default ModalUploadPhoto;
