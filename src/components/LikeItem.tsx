import React from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';

import { ColorTheme } from '@app/Colors';
import { useThemeColors } from '@app/hooks/UseThemeColor';

type LikeItemProps = {
  title: string;
  surface: number;
  description: string;
  imageUrl: string;
};

export default function LikeItem({ title, surface, description, imageUrl }: LikeItemProps) {
  const colors = useThemeColors();
  const styles = createStyles(colors);

  return (
    <View style={styles.likesContainer}>
      <Image source={{ uri: imageUrl }} style={styles.image} />
      <View style={styles.likesContent}>
        <Text numberOfLines={1} ellipsizeMode="tail" style={styles.title}>
          {title}
        </Text>
        <Text numberOfLines={1} ellipsizeMode="tail">
          {surface} m²
        </Text>
        <Text numberOfLines={1} ellipsizeMode="tail">
          {description}
        </Text>
      </View>
    </View>
  );
}

const createStyles = (colors: ColorTheme) =>
  StyleSheet.create({
    likesContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: 10,
    },
    image: {
      width: 70,
      height: 70,
      borderRadius: 5,
      marginRight: 10,
    },
    likesContent: {
      flex: 1,
    },
    title: {
      fontSize: 16,
      fontWeight: 'bold',
    },
  });
