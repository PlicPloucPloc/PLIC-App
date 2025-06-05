import React from 'react';
import { Alert, StyleSheet, Text, View } from 'react-native';

import { ColorTheme } from '@app/Colors';
import { useThemeColors } from '@app/hooks/UseThemeColor';
import AuthStackButton from '@components/AuthStackButton';
import BackgroundBuildings from '@components/BackgroundBuildings';
import { Ionicons } from '@expo/vector-icons';
import { RegisterStackScreenProps } from '@navigation/Types';

export default function RegisterSuccessfulScreen({
  navigation,
}: RegisterStackScreenProps<'Successful'>) {
  const colors = useThemeColors();
  const styles = createStyles(colors);

  return (
    <View style={styles.container}>
      <View style={styles.messageContainer}>
        <Ionicons name="mail-unread" size={100} color={'green'} />
        <Text style={styles.title}>Account created!</Text>
        <Text style={styles.message}>
          We've sent you a confirmation email. Please click the link in the email to verify your
          registration.
        </Text>
        <Text style={styles.message}>After verifying, you can log in with your credentials.</Text>

        <AuthStackButton
          title="Go to Login"
          onPress={() => {
            const parentNavigation = navigation.getParent();
            if (!parentNavigation) {
              return navigation.navigate('Welcome');
            }

            parentNavigation?.reset({
              index: 1,
              routes: [
                { name: 'Welcome' },
                {
                  name: 'Login',
                  params: { navigateFromRegister: true },
                },
              ],
            });
          }}
        />
        <AuthStackButton
          title="Resend email"
          onPress={() => {
            Alert.alert('Feature not implemented', 'This feature is not yet available.');
          }}
        />
      </View>

      <BackgroundBuildings />
    </View>
  );
}

const createStyles = (colors: ColorTheme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      backgroundColor: colors.background,
    },
    messageContainer: {
      flex: 3,
      alignItems: 'center',
      justifyContent: 'space-evenly',
      paddingTop: 50,
      paddingHorizontal: 30,
      marginHorizontal: 16,
    },
    title: {
      fontSize: 28,
      fontWeight: 'bold',
      textAlign: 'center',
      color: colors.textPrimary,
    },
    message: {
      fontSize: 16,
      textAlign: 'center',
      color: colors.textSecondary,
    },
  });
