import React from 'react';
import { Image, StyleSheet, View } from 'react-native';

import { Images } from '@assets/index';

export default function SplashScreen() {
  return (
    <View style={styles.container}>
      <Image source={Images.logo} style={styles.logo} resizeMode="contain" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    width: '60%',
    height: '20%',
  },
});
