import React from 'react';
import { Text, TouchableOpacity, View, StyleSheet } from 'react-native';

import { Ionicons } from '@expo/vector-icons';
import { ParamListBase } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';

import { ColorTheme } from '@app/Colors';
import { useThemeColors } from '@app/hooks/UseThemeColor';

type FiltersNotSetProps = {
  navigation: StackNavigationProp<ParamListBase>;
};

export default function FiltersNotSet({ navigation }: FiltersNotSetProps) {
  const colors = useThemeColors();
  const styles = createStyles(colors);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>No filters set!</Text>
      <Ionicons name="options-outline" size={100} color={colors.textPrimary} style={styles.icon} />
      <Text style={styles.text}>Please set your filters to start swiping through apartments.</Text>

      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('AccountStack', { screen: 'Account' })}>
        <Text style={styles.buttonText}>Edit preferences</Text>
      </TouchableOpacity>
    </View>
  );
}

const createStyles = (colors: ColorTheme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      paddingHorizontal: 20,
      justifyContent: 'center',
      backgroundColor: colors.background,
      paddingBottom: 100,
    },
    title: {
      fontSize: 20,
      fontWeight: 'bold',
      marginBottom: 20,
      textAlign: 'center',
    },
    icon: {
      alignSelf: 'center',
      marginBottom: 20,
    },
    text: {
      fontSize: 16,
      textAlign: 'center',
      marginBottom: 20,
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
