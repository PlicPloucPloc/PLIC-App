import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { ColorTheme } from '@app/Colors';
import { useThemeColors } from '@app/hooks/UseThemeColor';
import { SharedStackScreenProps } from '@navigation/Types';

export default function OtherProfileScreen({}: SharedStackScreenProps<'OtherProfile'>) {
  const colors = useThemeColors();
  const styles = createStyles(colors);

  return (
    <View style={styles.container}>
      <Text style={{ color: colors.textPrimary, fontSize: 18, fontWeight: 'bold' }}>
        Other Profile Screen
      </Text>
    </View>
  );
}

const createStyles = (colors: ColorTheme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      paddingHorizontal: 15,
      backgroundColor: colors.background,
    },
  });
