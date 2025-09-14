import React, { useRef, useState } from 'react';
import {
  Alert,
  Keyboard,
  StyleSheet,
  Text,
  TextInput,
  TouchableWithoutFeedback,
  View,
} from 'react-native';

import { ColorTheme } from '@app/Colors';
import { useThemeColors } from '@app/hooks/UseThemeColor';
import { RootState } from '@app/redux/Store';
import { registerUser } from '@app/rest/UserService';
import { checkPassword } from '@app/utils/Auth';
import AuthStackButton from '@components/AuthStackButton';
import BackgroundBuildings from '@components/BackgroundBuildings';
import Loader from '@components/Loader';
import PasswordInput from '@components/PasswordInput';
import { AuthStackScreenProps } from '@navigation/Types';
import { useSelector } from 'react-redux';

export default function RegisterPasswordScreen({
  navigation,
}: AuthStackScreenProps<'RegisterPassword'>) {
  const colors = useThemeColors();
  const styles = createStyles(colors);

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const authState = useSelector((state: RootState) => state.authState);

  const confirmPasswordInputRef = useRef<TextInput>(null);

  async function handleRegister() {
    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match.');
      return;
    }

    const passwordValidation = checkPassword(password);
    if (passwordValidation) {
      Alert.alert('Error', passwordValidation);
      return;
    }

    const userInfo = { ...authState, password };

    setLoading(true);
    const isRegistered = await registerUser(userInfo);
    setLoading(false);

    if (isRegistered) {
      navigation.navigate('VerifyEmail', { isNewlyRegistered: true });
    }
  }

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} style={styles.container}>
      <View style={styles.container}>
        <Loader loading={loading} />
        <View style={styles.buttonContainer}>
          <Text style={styles.title}>Register - Password</Text>
          <PasswordInput
            value={password}
            onChangeText={setPassword}
            placeholder="Password"
            placeholderTextColor={colors.textSecondary}
            onSubmitEditing={() => confirmPasswordInputRef.current?.focus()}
          />

          <PasswordInput
            ref={confirmPasswordInputRef}
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            placeholder="Confirm Password"
            placeholderTextColor={colors.textSecondary}
            onSubmitEditing={handleRegister}
          />

          <AuthStackButton title="Register" onPress={handleRegister} disabled={loading} />
        </View>

        <BackgroundBuildings />
      </View>
    </TouchableWithoutFeedback>
  );
}

const createStyles = (colors: ColorTheme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: colors.background,
    },
    title: {
      fontSize: 28,
      fontWeight: 'bold',
      color: colors.textPrimary,
    },
    buttonContainer: {
      flex: 3,
      width: '100%',
      justifyContent: 'center',
      alignItems: 'center',
      gap: 20,
      paddingHorizontal: 20,
    },
  });
