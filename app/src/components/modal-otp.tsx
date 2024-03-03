import { StyleSheet, View, Modal, Dimensions, TextInput } from 'react-native';
import React, { useEffect, useRef, useState } from 'react';

// modules
import { useNavigation } from '@react-navigation/native';
import Typography from './typography';
import ThemeButton from './button';
import api from '@/libs/api';
import LottieView from 'lottie-react-native';

const ModalOtp = ({ token, visible }: { token: string; visible: boolean }) => {
  const [otp, setOtp] = useState(['', '', '', '']);
  const inputs = useRef([]);
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);
  const [isActivated, setIsActivated] = useState(false);
  const animation = useRef(null);
  const navigator = useNavigation();

  useEffect(() => {
    if (otp.every((digit) => digit !== '')) {
      setIsButtonDisabled(false);
    } else {
      setIsButtonDisabled(true);
    }
  }, [otp]);

  const handleOtpChange = (value, index) => {
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < newOtp.length - 1) {
      inputs.current[index + 1].focus();
    }
  };

  const handleBackspacePress = (index) => {
    if (!otp[index] && index > 0) {
      inputs.current[index - 1].focus();
    }
  };

  const handleOtpSubmit = () => {
    console.log(otp.join(''));
  };

  const handleButtonPress = async () => {
    const response = await api.auth.activateAccount({
      userAuthToken: token,
      data: {
        activationCode: otp.join(''),
      },
    }).request;

    if (response.status !== 401) {
      setIsActivated(true);
      animation.current.play();
      setTimeout(() => {
        (navigator as any).navigate('Login');
      }, 2000);
    } else {
      setOtp(['', '', '', '']);
    }
  };

  return (
    <Modal animationType="fade" transparent={true} visible={visible}>
      <View style={styles.container}>
        <View
          className="flex-col items-center justify-between py-10 space-y-8"
          style={styles.modalStyle}
        >
          <View>
            <Typography variant="h4" text="Verifica tu correo!" />
          </View>
          <View className="flex flex-row">
            {otp.map((digit, index) => (
              <TextInput
                key={index}
                style={styles.box}
                maxLength={1}
                keyboardType="numeric"
                onChangeText={(value) => handleOtpChange(value, index)}
                value={digit}
                ref={(input) => {
                  inputs.current[index] = input;
                }}
                onSubmitEditing={
                  index === otp.length - 1 ? handleOtpSubmit : undefined
                }
                onKeyPress={({ nativeEvent: { key } }) =>
                  key === 'Backspace' ? handleBackspacePress(index) : null
                }
              />
            ))}
          </View>
          {isActivated ? (
            <LottieView
              ref={animation}
              style={styles.lottie}
              source={{
                uri: 'https://lottie.host/6d633fe8-64ac-463d-84d8-a60a7778b864/3EprNdDcxW.json',
              }}
            />
          ) : (
            <ThemeButton
              text="Activar cuenta"
              onPress={handleButtonPress}
              disabled={isButtonDisabled}
            />
          )}
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  box: {
    borderWidth: 1,
    borderColor: 'black',
    width: 47,
    height: 46,
    margin: 8,
    textAlign: 'center',
    fontSize: 20,
    borderRadius: 5,
    borderStyle: 'solid',
    padding: 5,
  },
  lottie: {
    width: 150,
    height: 150,
  },
  modalStyle: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 25,
    width: Dimensions.get('window').width / 1.5,
  },
});

export default ModalOtp;
