import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { Image } from "expo-image";
import React, { useEffect } from "react";
import {
  View,
  TouchableOpacity,
  Dimensions,
  ActivityIndicator,
} from "react-native";

import ModalUploadPhoto from "@/components/modal-upload-photo";
import ThemeView from "@/components/screen";
import Typography from "@/components/typography";
import { useAuth } from "@/contexts/auth-provider";
import { useLocalization } from "@/contexts/locale-provider";
import api from "@/libs/api";

const blurhash =
  "|rF?hV%2WCj[ayj[a|j[az_NaeWBj@ayfRayfQfQM{M|azj[azf6fQfQfQIpWXofj[ayj[j[fQayWCoeoeaya}j[ayfQa{oLj?j[WVj[ayayj[fQoff7azayj[ayj[j[ayofayayayj[fQj[ayayj[ayfjj[j[ayjuayj[";

const Profile: React.FC = () => {
  const { backendTokens } = useAuth();
  const navigation = useNavigation();
  const { t } = useLocalization();
  const [profile, setProfile] = React.useState<any>(null);
  const [openModal, setOpenModal] = React.useState(false);

  useEffect(() => {
    const getData = async () => {
      if (backendTokens) {
        const response = await api.profile.getProfile({
          userAuthToken: backendTokens.accessToken,
        }).request;

        setProfile(response.data);
      }
    };

    getData();
  }, [backendTokens]);

  return (
    <ThemeView>
      <View
        className="flex-col justify-between "
        style={{
          height: Dimensions.get("window").height - 150,
        }}
      >
        <View className="space-y-4 ">
          <View className="flex flex-row items-center justify-between w-full">
            <Typography variant="h1" text={t("profile.title")} />
            <TouchableOpacity
              onPress={() => (navigation as any).navigate("settings")}
            >
              <Ionicons size={28} name="settings-sharp" />
            </TouchableOpacity>
          </View>
          {profile ? (
            <View>
              <View className="flex flex-col items-center justify-center w-full">
                <Image
                  className="w-48 h-48 rounded-full"
                  source={profile?.avatar}
                  contentFit="cover"
                  transition={1000}
                  placeholder={blurhash}
                />
                <TouchableOpacity onPress={() => setOpenModal(true)}>
                  <Typography variant="p" text={t("profile.changePhoto")} />
                </TouchableOpacity>
              </View>

              <View>
                <View className="flex flex-col items-center justify-center w-full">
                  <Typography
                    variant="h2"
                    text={`${profile?.name} ${profile?.lastname}`}
                  />

                  <Typography variant="p" text={profile?.email} />
                </View>
              </View>
            </View>
          ) : (
            <ActivityIndicator size="large" color="#000" />
          )}
        </View>
      </View>
      <ModalUploadPhoto
        token={backendTokens?.accessToken}
        visible={openModal}
        setVisible={setOpenModal}
      />
    </ThemeView>
  );
};

export default Profile;
