import React from 'react';
import { Image, Text, View, StyleSheet } from 'react-native';

import { ParamListBase } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';

import { ColorTheme } from '@app/Colors';
import { useThemeColors } from '@app/hooks/UseThemeColor';
import { Images } from '@assets/index';

type EverythingSwipedProps = {
  navigation: StackNavigationProp<ParamListBase>;
};

export default function EverythingSwiped(_: EverythingSwipedProps) {
  const colors = useThemeColors();
  const styles = createStyles(colors);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>You’ve seen all the apartments nearby!</Text>
      <Image source={Images.noResults} style={styles.image} />
      <Text style={styles.text}>
        Try expanding your filters or check your favorites while we look for new listings.
      </Text>

      {/* <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('AccountStack')}> */}
      {/*   <Text style={styles.buttonText}>Edit preferences</Text> */}
      {/* </TouchableOpacity> */}
    </View>
  );
}

const createStyles = (colors: ColorTheme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      padding: 30,
    },
    title: {
      fontSize: 18,
      fontWeight: 'bold',
      marginBottom: 20,
      textAlign: 'center',
    },
    image: {
      width: 150,
      height: 150,
      alignSelf: 'center',
      marginBottom: 20,
    },
    text: {
      fontSize: 16,
      marginTop: 30,
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
