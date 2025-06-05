import React, { useState } from 'react';
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
import * as AuthActions from '@app/redux/slices/app/AuthStateSlice';
import store, { RootState } from '@app/redux/Store';
import { checkEmailExists } from '@app/rest/UserApi';
import { checkEmail } from '@app/utils/Auth';
import AuthStackButton from '@components/AuthStackButton';
import BackgroundBuildings from '@components/BackgroundBuildings';
import Loader from '@components/Loader';
import { RegisterStackScreenProps } from '@navigation/Types';
import { useSelector } from 'react-redux';

export default function RegisterEmailScreen({ navigation }: RegisterStackScreenProps<'Email'>) {
  const colors = useThemeColors();
  const styles = createStyles(colors);

  const authState = useSelector((state: RootState) => state.authState);

  const [email, setEmail] = useState(authState.email ?? '');
  const [loading, setLoading] = useState(false);

  async function handleNext() {
    const emailValidation = checkEmail(email);
    if (emailValidation) {
      Alert.alert('Error', emailValidation);
      return;
    }

    setLoading(true);
    const response = await checkEmailExists(email);
    setLoading(false);

    if (!response.ok) {
      const errorData = await response.json();
      Alert.alert(
        'Register Error',
        errorData.message || 'An error occurred during email checking.',
      );
      return;
    }

    const data = await response.json();
    if (data.emailTaken) {
      Alert.alert(
        'Register Error',
        'This email is already registered. Please use a different email.',
      );
      return;
    }

    store.dispatch(AuthActions.setEmail(email));
    navigation.navigate('UserInfo');
  }

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} style={styles.container}>
      <View style={styles.container}>
        <Loader loading={loading} />

        <View style={styles.buttonContainer}>
          <Text style={styles.title}>Register - Email</Text>
          <TextInput
            placeholder="Email"
            placeholderTextColor={colors.textSecondary}
            value={email}
            onChangeText={setEmail}
            style={styles.input}
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
            autoFocus={true}
            editable={!loading}
            onSubmitEditing={handleNext}
            onBlur={() => store.dispatch(AuthActions.setEmail(email))}
          />

          <AuthStackButton title="Next" onPress={handleNext} disabled={loading} />
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
    input: {
      width: '100%',
      padding: 12,
      borderWidth: 1,
      borderColor: colors.contrast,
      borderRadius: 10,
      fontSize: 16,
      color: colors.textPrimary,
    },
  });
