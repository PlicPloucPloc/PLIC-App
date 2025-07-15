import React from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';

import { ColorTheme } from '@app/Colors';
import { RELATION_TYPE } from '@app/definitions/rest/RelationService';
import { useThemeColors } from '@app/hooks/UseThemeColor';
import { Ionicons } from '@expo/vector-icons';

type ApartmentListItemProps = {
  title: string;
  location: string;
  surface: number;
  rent: number;
  imageUrl: string;
  relationType?: RELATION_TYPE;
};

export default function ApartmentListItem({
  title,
  surface,
  rent,
  location,
  imageUrl,
  relationType,
}: ApartmentListItemProps) {
  const colors = useThemeColors();
  const styles = createStyles(colors);

  return (
    <View style={styles.likesContainer}>
      <View style={styles.imageWrapper}>
        <Image source={{ uri: imageUrl }} style={styles.image} />
        {relationType && (
          <View style={styles.iconOverlay}>
            {relationType === 'LIKE' ? (
              <Ionicons name="heart" size={16} color={colors.primary} />
            ) : (
              <Ionicons name="close" size={16} color="red" />
            )}
          </View>
        )}
      </View>
      <View style={styles.likesContent}>
        <Text numberOfLines={1} ellipsizeMode="tail" style={styles.title}>
          {title}
        </Text>
        <Text numberOfLines={1} ellipsizeMode="tail">
          {location}
        </Text>
        <Text numberOfLines={1} ellipsizeMode="tail">
          {surface} m² / {rent} €
        </Text>
      </View>
    </View>
  );
}

const createStyles = (_: ColorTheme) =>
  StyleSheet.create({
    likesContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: 10,
    },
    imageWrapper: {
      position: 'relative',
    },
    image: {
      width: 70,
      height: 70,
      borderRadius: 5,
      marginRight: 10,
    },
    iconOverlay: {
      position: 'absolute',
      bottom: -4,
      right: 4,
      backgroundColor: '#fff',
      borderRadius: 10,
      padding: 2,
      elevation: 2,
    },
    likesContent: {
      flex: 1,
    },
    title: {
      fontSize: 16,
      fontWeight: 'bold',
    },
  });
