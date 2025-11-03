import React from 'react';
import { Image, Text, TouchableOpacity, View, StyleSheet } from 'react-native';

import { ColorTheme } from '@app/Colors';
import { useThemeColors } from '@app/hooks/UseThemeColor';
import { Images } from '@assets/index';

type ColocFinderNotEnabledProps = {
  toggleSwitch: (enabled: boolean) => void;
};

export default function ColocFinderNotEnabled({ toggleSwitch }: ColocFinderNotEnabledProps) {
  const colors = useThemeColors();
  const styles = createStyles(colors);
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Find your perfect roommates !</Text>

      <Image source={Images.roommates} style={styles.image} />

      <Text style={styles.text}>
        Enable the coloc finder to connect with people who share your vibe and lifestyle.
      </Text>

      <Text style={styles.note}>
        Once enabled, your profile becomes visible to others looking for roommates.
      </Text>

      <TouchableOpacity style={styles.button} onPress={() => toggleSwitch(true)}>
        <Text style={styles.buttonText}>Enable Now</Text>
      </TouchableOpacity>
    </View>
  );
}

const createStyles = (colors: ColorTheme) =>
  StyleSheet.create({
    container: {
      height: '85%',
      width: '100%',
      justifyContent: 'center',
      padding: 24,
    },
    title: {
      color: colors.textPrimary,
      fontSize: 18,
      fontWeight: 'bold',
      textAlign: 'center',
      marginBottom: 20,
    },
    image: {
      width: '100%',
      height: 150,
      resizeMode: 'contain',
      marginBottom: 20,
    },
    text: {
      color: colors.textSecondary,
      fontSize: 16,
      textAlign: 'center',
      marginBottom: 20,
    },
    note: {
      color: colors.textSecondary,
      fontSize: 14,
      textAlign: 'center',
      marginBottom: 40,
      opacity: 0.8,
    },
    button: {
      backgroundColor: colors.primary,
      paddingVertical: 10,
      borderRadius: 10,
      borderWidth: 1,
      elevation: 3,
    },
    buttonText: {
      color: colors.textPrimary,
      fontSize: 16,
      fontWeight: '600',
      textAlign: 'center',
    },
  });
