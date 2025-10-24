import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { Ionicons } from '@expo/vector-icons';
import { useSelector } from 'react-redux';

import { ColorTheme } from '@app/Colors';
import { IoniconName } from '@app/definitions';
import { useThemeColors } from '@app/hooks/UseThemeColor';
import { RootState } from '@app/redux/Store';
import { resendVerificationEmail } from '@app/rest/UserService';
import AuthStackButton from '@components/AuthStackButton';
import BackgroundBuildings from '@components/BackgroundBuildings';
import { AuthStackScreenProps } from '@navigation/Types';

type screenConfigType = {
  icon: { name: IoniconName; color: string };
  title: string;
  subtitle: string;
  intro: string;
  boldIntro: boolean;
  buttonTitle: string;
};

export default function VerifyEmailScreen({
  navigation,
  route,
}: AuthStackScreenProps<'VerifyEmail'>) {
  const { isNewlyRegistered } = route.params;
  const styles = createStyles(useThemeColors());
  const authState = useSelector((state: RootState) => state.authState);

  const [cooldown, setCooldown] = useState(0);
  const [loading, setLoading] = useState(false);

  async function handleResendEmail() {
    setLoading(true);

    const emailResent = await resendVerificationEmail({ email: authState.email });

    if (emailResent) {
      Alert.alert('Success', 'Verification email resent. Please check your inbox.');
      setCooldown(60);
    }
    setLoading(false);
  }

  useEffect(() => {
    if (cooldown > 0) {
      const timer = setTimeout(() => setCooldown(cooldown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [cooldown]);

  // Screen configuration based on registration status
  const screenConfig = (
    isNewlyRegistered
      ? {
          icon: { name: 'mail-unread', color: 'green' },
          title: 'Account created!',
          subtitle: 'Welcome aboard 🎉',
          intro: 'We’ve sent a confirmation email to:',
          boldIntro: false,
          buttonTitle: 'Go to Login',
        }
      : {
          icon: { name: 'warning', color: 'orange' },
          title: 'Email not verified',
          subtitle: 'Please check your inbox 📩',
          intro: 'Your account is created but not yet verified.',
          boldIntro: true,
          buttonTitle: 'Back to Login',
        }
  ) as screenConfigType;

  const handleButtonClick = isNewlyRegistered
    ? () => {
        navigation.reset({
          index: 1,
          routes: [{ name: 'Welcome' }, { name: 'Login', params: { navigateFromRegister: true } }],
        });
      }
    : () => navigation.goBack();

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Ionicons name={screenConfig.icon.name} size={100} color={screenConfig.icon.color} />
        <Text style={styles.title}>{screenConfig.title}</Text>
        <Text style={styles.subtitle}>{screenConfig.subtitle}</Text>
      </View>

      <View style={styles.body}>
        <Text style={[styles.message, screenConfig.boldIntro && { fontWeight: 'bold' }]}>
          {screenConfig.intro}
        </Text>
        <Text style={styles.email}>{authState.email}</Text>

        <Text style={[styles.message, { marginTop: 20 }]}>
          Please click the link in the email to verify your registration. Once verified, you can log
          in with your credentials.
        </Text>

        <View style={styles.resendEmail}>
          <Text style={styles.message}>Didn`&apos;`t receive the email? </Text>
          {loading && <ActivityIndicator size="small" color={styles.resendEmailLink.color} />}
          {!loading && cooldown > 0 && (
            <Text style={styles.cooldownText}>Resend in {cooldown}s</Text>
          )}
          {!loading && cooldown === 0 && (
            <TouchableOpacity onPress={handleResendEmail}>
              <Text style={styles.resendEmailLink}>Resend</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      <View style={styles.buttonContainer}>
        <AuthStackButton title={screenConfig.buttonTitle} onPress={handleButtonClick} />
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
    header: {
      flex: 2,
      alignItems: 'center',
      justifyContent: 'flex-end',
      paddingTop: 60,
    },
    title: {
      fontSize: 28,
      fontWeight: 'bold',
      color: colors.textPrimary,
      marginTop: 12,
    },
    subtitle: {
      fontSize: 18,
      color: colors.textSecondary,
      marginTop: 2,
    },

    body: {
      flex: 2,
      alignItems: 'center',
      justifyContent: 'center',
      paddingHorizontal: 10,
      marginTop: 20,
    },
    message: {
      fontSize: 15,
      textAlign: 'center',
      color: colors.textSecondary,
    },
    email: {
      fontSize: 16,
      fontWeight: 'bold',
      color: colors.contrast,
      textAlign: 'center',
    },
    resendEmail: {
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      marginTop: 20,
    },
    resendEmailLink: {
      fontSize: 15,
      color: colors.primary,
      fontWeight: 'bold',
    },
    cooldownText: {
      fontSize: 15,
      color: colors.textSecondary,
      fontStyle: 'italic',
    },

    buttonContainer: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      marginTop: 20,
    },
  });
