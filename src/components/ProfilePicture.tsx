import React, { useEffect, useState } from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { AuthState } from '@app/definitions/redux';
import { useThemeColors } from '@app/hooks/UseThemeColor';
import { RootState } from '@app/redux/Store';
import { Ionicons } from '@expo/vector-icons';
import { useSelector } from 'react-redux';

type ProfilePictureProps = {
  size: number;
  imageUri?: string | null;
  userInfo?: AuthState;
  borderRadius?: number;
  onRemove?: () => void;
};

export default function ProfilePicture({
  size = 100,
  imageUri,
  userInfo,
  borderRadius = size / 2,
  onRemove = undefined,
}: ProfilePictureProps) {
  const colors = useThemeColors();
  const styles = createStyles(colors);

  const computeInitials = (firstName: string, lastName: string) =>
    `${firstName[0]}${lastName[0]}`.toUpperCase();

  const authState = useSelector((state: RootState) => state.authState);
  const [initials, setInitials] = useState(
    computeInitials(authState.firstName, authState.lastName),
  );

  const [uri, setUri] = useState<string | null>(null);

  useEffect(() => {
    if (userInfo && imageUri) {
      console.warn(
        'Only one of userInfo or imageUri should be provided to ProfilePicture component.',
      );
    }

    if (userInfo !== undefined) {
      setUri(userInfo.profilePictureUri);
      setInitials(computeInitials(userInfo.firstName, userInfo.lastName));
    } else if (imageUri !== undefined) {
      setUri(imageUri);
    }
  }, [userInfo, imageUri]);

  return (
    <View style={[styles.imageContainer, { width: size, height: size }]}>
      {uri ? (
        <>
          <Image
            source={{ uri: uri }}
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
