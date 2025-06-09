import React from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';

import { ColorTheme } from '@app/Colors';
import { useThemeColors } from '@app/hooks/UseThemeColor';

type LikeItemProps = {
  title: string;
  price: string;
  description: string;
  imageUrl: string;
};

export default function LikeItem({ title, price, description, imageUrl }: LikeItemProps) {
  const colors = useThemeColors();
  const styles = createStyles(colors);

  return (
    <View style={styles.likesContainer}>
      <Image source={{ uri: imageUrl }} style={styles.image} />
      <View style={styles.likesContent}>
        <Text style={styles.title}>{title}</Text>
        <Text>{price}</Text>
        <Text>{description}</Text>
      </View>
    </View>
  );
}

const createStyles = (colors: ColorTheme) =>
  StyleSheet.create({
    likesContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: 20,
      borderBottomWidth: 1,
      borderBottomColor: colors.contrast,
    },
    image: {
      width: 80,
      height: 80,
      borderRadius: 10,
      marginRight: 20,
    },
    likesContent: {
      flex: 1,
    },
    title: {
      fontSize: 18,
      fontWeight: 'bold',
    },
  });
