import React from 'react';
import { Text, TouchableOpacity, StyleSheet } from 'react-native';

import { Ionicons } from '@expo/vector-icons';
import Reanimated, { SharedValue, useAnimatedStyle } from 'react-native-reanimated';

import { ColorTheme } from '@app/Colors';
import { useThemeColors } from '@app/hooks/UseThemeColor';

type RightActionProps = {
  drag: SharedValue<number>;
  onPress: () => void;
};

export default function RightActionDelete({ drag, onPress }: RightActionProps) {
  const colors = useThemeColors();
  const styles = createStyles(colors);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: drag.value + 100 }],
  }));

  return (
    <Reanimated.View style={[styles.rightAction, animatedStyle]}>
      <TouchableOpacity onPress={onPress} style={styles.actionTouchable}>
        <Ionicons name="trash-outline" size={24} color={colors.textPrimary} />
        <Text style={styles.actionText}>Delete</Text>
      </TouchableOpacity>
    </Reanimated.View>
  );
}

const createStyles = (colors: ColorTheme) =>
  StyleSheet.create({
    rightAction: {
      width: 100,
      height: '100%',
      justifyContent: 'center',
      alignItems: 'center',
    },
    actionTouchable: {
      flex: 1,
      width: '100%',
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'red',
    },
    actionText: {
      color: colors.textPrimary,
      fontWeight: 'bold',
    },
  });
