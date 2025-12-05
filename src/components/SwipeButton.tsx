import React from 'react';
import { TouchableOpacity, StyleSheet, TouchableOpacityProps } from 'react-native';

import { Ionicons } from '@expo/vector-icons';

import { ColorTheme } from '@app/Colors';
import { IoniconName } from '@app/definitions';
import { useThemeColors } from '@app/hooks/UseThemeColor';

const ICON_PADDING = 8;

type SwipeButtonProps = TouchableOpacityProps & {
  icon: {
    name: IoniconName;
    size: number;
    color: string;
  };
  hidden?: boolean;
};

export default function SwipeButton({ icon, hidden, onPress, disabled, style }: SwipeButtonProps) {
  const colors = useThemeColors();
  const styles = createStyles(colors);

  const containerStyle = hidden
    ? { opacity: 0, padding: ICON_PADDING }
    : [style ?? styles.button, { opacity: disabled ? 0.5 : 1 }];

  return (
    <TouchableOpacity onPress={onPress} style={containerStyle} disabled={hidden ? true : disabled}>
      <Ionicons
        name={icon.name}
        size={icon.size}
        color={icon.color}
        style={hidden && { opacity: 0 }}
      />
    </TouchableOpacity>
  );
}

const createStyles = (colors: ColorTheme) =>
  StyleSheet.create({
    button: {
      padding: 8,
      borderRadius: 40,
      backgroundColor: colors.background,
      elevation: 4,
      justifyContent: 'center',
      alignItems: 'center',
      shadowColor: 'black',
    },
  });
