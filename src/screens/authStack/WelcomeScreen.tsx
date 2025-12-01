import React from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';

import { ColorTheme } from '@app/Colors';
import { useThemeColors } from '@app/hooks/UseThemeColor';
import { Images } from '@assets/index';
import AuthStackButton from '@components/AuthStackButton';
import BackgroundBuildings from '@components/BackgroundBuildings';
import { AuthStackScreenProps } from '@navigation/Types';

export default function WelcomeScreen({ navigation }: AuthStackScreenProps<'Welcome'>) {
  const colors = useThemeColors();
  const styles = createStyles(colors);

  return (
    <View style={styles.container}>
      <View style={styles.logoContainer}>
        <Image source={Images.logo} style={styles.logo} />
        <Text style={styles.title}>SwAppart</Text>
      </View>

      <View style={styles.buttonContainer}>
        <AuthStackButton
          title="Log In"
          onPress={() => navigation.navigate('Login', {})}
          containerStyle={{ backgroundColor: colors.background }}
        />
        <AuthStackButton title="Register" onPress={() => navigation.navigate('RegisterEmail')} />
      </View>

      <BackgroundBuildings />
    </View>
  );
}

const createStyles = (colors: ColorTheme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },

    logoContainer: {
      flex: 2,
      width: '100%',
      justifyContent: 'flex-end',
      alignItems: 'center',
      paddingBottom: 20,
    },
    logo: {
      width: '50%',
      justifyContent: 'space-evenly',
    },
    title: {
      fontSize: 34,
      fontWeight: 'bold',
      color: colors.textPrimary,
    },

    buttonContainer: {
      flex: 1,
      width: '100%',
      paddingHorizontal: 20,
    },
  });
