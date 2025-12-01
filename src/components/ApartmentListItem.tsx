import React, { memo } from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';

import { Ionicons } from '@expo/vector-icons';

import { ColorTheme } from '@app/Colors';
import { RELATION_TYPE } from '@app/definitions';
import { useThemeColors } from '@app/hooks/UseThemeColor';

type ApartmentListItemProps = {
  title: string;
  location: string;
  surface: number;
  rent: number;
  imageUrl: string;
  relationType?: RELATION_TYPE;
};

const ApartmentListItem = memo(
  ({ title, surface, rent, location, imageUrl, relationType }: ApartmentListItemProps) => {
    const colors = useThemeColors();
    const styles = createStyles(colors);

    return (
      <View style={styles.likesContainer}>
        <View style={{ position: 'relative' }}>
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
  },
);

ApartmentListItem.displayName = 'ApartmentListItem';

export default ApartmentListItem;

const createStyles = (_: ColorTheme) =>
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
