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
      alignItems: 'center',
      paddingVertical: 10,
      marginTop: 20,
      borderColor: colors.textSecondary,
      borderRadius: 8,
      borderWidth: 1,
      elevation: 5,
    },
    text: {
      color: colors.textPrimary,
      fontWeight: '600',
      fontSize: 20,
    },
  });
