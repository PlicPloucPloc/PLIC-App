import React from 'react';
import { StyleSheet, Text, TextStyle, TouchableOpacity, ViewStyle } from 'react-native';

import { ColorTheme } from '@app/Colors';
import { useThemeColors } from '@app/hooks/UseThemeColor';

type AuthStackButtonProps = {
  title: string;
  onPress: () => void;
  containerStyle?: ViewStyle;
  textStyle?: TextStyle;
  disabled?: boolean;
};

export default function AuthStackButton({
  title,
  onPress,
  containerStyle,
  textStyle,
  disabled,
}: AuthStackButtonProps) {
  const colors = useThemeColors();
  const styles = createStyles(colors);

  return (
    <TouchableOpacity
      onPress={onPress}
      style={[styles.container, containerStyle, disabled && { opacity: 0.6 }]}
      disabled={disabled}>
      <Text style={[styles.text, textStyle]}>{title}</Text>
    </TouchableOpacity>
  );
}

const createStyles = (colors: ColorTheme) =>
  StyleSheet.create({
    container: {
      backgroundColor: colors.primary,
      borderColor: colors.contrast,
      alignItems: 'center',
      justifyContent: 'center',
      width: '65%',
      padding: 3,
      borderRadius: 100,
      borderWidth: 2,
      elevation: 3,
    },
    text: {
      color: colors.textPrimary,
      fontSize: 22,
      fontWeight: 'bold',
    },
  });
