import React from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { useThemeColors } from '@app/hooks/UseThemeColor';
import { RootState } from '@app/redux/Store';
import { Ionicons } from '@expo/vector-icons';
import { useSelector } from 'react-redux';

type ProfilePictureProps = {
  size: number;
  imageUri: string | null;
  borderRadius?: number;
  onRemove?: () => void;
};

export default function ProfilePicture({
  size = 100,
  borderRadius = size / 2,
  imageUri = null,
  onRemove = undefined,
}: ProfilePictureProps) {
  const colors = useThemeColors();
  const styles = createStyles(colors);

  const authState = useSelector((state: RootState) => state.authState);
  const initials = `${authState.firstName[0]}${authState.lastName[0]}`.toUpperCase();

  return (
    <View style={[styles.imageContainer, { width: size, height: size }]}>
      {imageUri ? (
        <>
          <Image
            source={{ uri: imageUri }}
            style={[
              styles.imagePreview,
              {
                width: size,
                height: size,
                borderRadius: borderRadius,
              },
            ]}
          />
          {onRemove && imageUri && (
            <TouchableOpacity
              onPress={onRemove}
              style={[styles.removeIcon, { backgroundColor: colors.background }]}>
              <Ionicons name="close-circle" size={size * 0.2} color="red" />
            </TouchableOpacity>
          )}
        </>
      ) : (
        <View
          style={[
            styles.placeholder,
            {
              width: size,
              height: size,
              borderRadius: borderRadius,
            },
          ]}>
          <Text style={[styles.placeholderInitials, { fontSize: size * 0.32 }]}>{initials}</Text>
        </View>
      )}
    </View>
  );
}

const createStyles = (colors: any) =>
  StyleSheet.create({
    imageContainer: {
      position: 'relative',
    },
    imagePreview: {
      borderWidth: 2,
      borderColor: colors.contrast,
    },
    removeIcon: {
      position: 'absolute',
      top: 0,
      right: 0,
      backgroundColor: colors.background,
      borderRadius: 100,
    },
    placeholder: {
      borderWidth: 2,
      borderColor: colors.contrast,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: colors.primary,
    },
    placeholderInitials: {
      color: 'white',
      fontWeight: 'bold',
    },
  });
