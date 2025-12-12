import React, { useRef, useState } from 'react';
import {
  Alert,
  Keyboard,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';

import { ColorTheme } from '@app/Colors';
import { RootEnum } from '@app/definitions';
import { useThemeColors } from '@app/hooks/UseThemeColor';
import { setRoot } from '@app/redux/slices';
import * as AuthActions from '@app/redux/slices/AuthStateSlice';
import store from '@app/redux/Store';
import { loginUser } from '@app/rest/UserService';
import { checkEmail, checkPassword } from '@app/utils/Auth';
import AuthStackButton from '@components/AuthStackButton';
import BackgroundBuildings from '@components/BackgroundBuildings';
import PasswordInput from '@components/PasswordInput';
import { AuthStackScreenProps } from '@navigation/Types';
import Loader from 'components/Loader';

export default function LoginScreen({ navigation }: AuthStackScreenProps<'Login'>) {
  const colors = useThemeColors();
  const styles = createStyles(colors);

  const passwordInputRef = useRef<TextInput>(null);
  const [loading, setLoading] = useState(false);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  async function handleLogin() {
    const emailValidation = checkEmail(email);
    if (emailValidation) {
      Alert.alert('Error', emailValidation);
      return;
    }

    const passwordValidation = checkPassword(password);
    if (passwordValidation) {
      Alert.alert('Error', passwordValidation);
      return;
    }

    setLoading(true);
    const response = await loginUser({ email, password }).finally(() => setLoading(false));

    if (response === null) {
      return navigation.navigate('VerifyEmail', { isNewlyRegistered: false });
    }

    if (response === false) {
      return;
    }

    store.dispatch(setRoot(RootEnum.ROOT_INSIDE));
  }

  const handleForgotPassword = () => {
    Alert.alert('Forgot Password', 'Password recovery is not implemented yet.');
  };

  return (
    <TouchableWithoutFeedback style={{ flex: 1 }} onPress={Keyboard.dismiss}>
      <View style={styles.container}>
        <Loader loading={loading} />
        <View style={styles.buttonContainer}>
          <Text style={styles.title}>Welcome back</Text>

          <TextInput
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
            style={styles.input}
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
            autoComplete="email"
            textContentType="emailAddress"
            returnKeyType="next"
            autoFocus={true}
            onSubmitEditing={() => passwordInputRef.current?.focus()}
            onBlur={() => store.dispatch(AuthActions.setEmail(email))}
          />

          <PasswordInput
            ref={passwordInputRef}
            value={password}
            onChangeText={setPassword}
            placeholder="Password"
            onSubmitEditing={handleLogin}
          />

          <TouchableOpacity onPress={handleForgotPassword}>
            <Text style={styles.forgotText}>Forgot your password?</Text>
          </TouchableOpacity>

          <AuthStackButton title="Log In" onPress={handleLogin} disabled={loading} />
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
      backgroundColor: colors.background,
    },
    title: {
      fontSize: 34,
      fontWeight: 'bold',
      color: colors.textPrimary,
      alignSelf: 'center',
    },

    buttonContainer: {
      flex: 3,
      width: '100%',
      justifyContent: 'center',
      gap: 20,
      paddingHorizontal: 20,
    },
    input: {
      width: '100%',
      padding: 12,
      borderWidth: 1,
      borderColor: colors.textSecondary,
      borderRadius: 10,
      fontSize: 16,
    },
    forgotText: {
      color: colors.primary,
      fontSize: 14,
      marginBottom: 10,
      alignSelf: 'center',
    },
  });
