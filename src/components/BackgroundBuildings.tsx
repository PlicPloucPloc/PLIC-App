import React from 'react';
import { Image, ImageStyle, StyleSheet, View, ViewStyle } from 'react-native';

import { Images } from '@assets/index';

interface BackgroundBuildingsProps {
  containerStyle?: ViewStyle;
  imageStyle?: ImageStyle;
}

export default function BackgroundBuildings(props: BackgroundBuildingsProps) {
  return (
    <View style={[styles.backgroundContainer, props.containerStyle]}>
      <Image source={Images.backgroundBuildings} style={[props.imageStyle, styles.image]} />
    </View>
  );
}

const styles = StyleSheet.create({
  backgroundContainer: {
    width: '100%',
    top: 20,
  },
  image: {
    width: '100%',
  },
});
