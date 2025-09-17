import React, { useState } from 'react';
import { Alert, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { useThemeColors } from '@app/hooks/UseThemeColor';
import * as AuthActions from '@app/redux/slices/AuthStateSlice';
import store, { RootState } from '@app/redux/Store';
import { selectImageFromMedia } from '@app/utils/Image';
import AuthStackButton from '@components/AuthStackButton';
import BackgroundBuildings from '@components/BackgroundBuildings';
import ProfilePicture from '@components/ProfilePicture';
import { Ionicons } from '@expo/vector-icons';
import { AuthStackScreenProps } from '@navigation/Types';
import { useSelector } from 'react-redux';

export default function RegisterPictureScreen({
  navigation,
}: AuthStackScreenProps<'RegisterPicture'>) {
  const colors = useThemeColors();
  const styles = createStyles(colors);

  const authState = useSelector((state: RootState) => state.authState);

  const [imageUri, setImageUri] = useState<string | null>(authState.profilePictureUri);

  const handleImageSelection = (source: 'camera' | 'gallery') =>
    selectImageFromMedia(source, async (uri: string) => {
      setImageUri(uri);
      store.dispatch(AuthActions.setProfilePictureUri(uri));
    });

  function handleRemoveImage() {
    setImageUri(null);
    store.dispatch(AuthActions.setProfilePictureUri(null));
  }

  function handleNext() {
    if (!imageUri) {
      Alert.alert('Error', 'Please select or take a profile picture, or skip.');
      return;
    }
    navigation.navigate('RegisterPassword');
  }

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Register - Profile Picture</Text>

        <ProfilePicture size={150} imageUri={imageUri} onRemove={handleRemoveImage} />

        <View style={styles.iconRow}>
          <TouchableOpacity
            onPress={() => handleImageSelection('gallery')}
            style={styles.iconButton}>
            <Ionicons name="images-outline" size={40} color={colors.contrast} />
            <Text style={styles.iconText}>Gallery</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => handleImageSelection('camera')}
            style={styles.iconButton}>
            <Ionicons name="camera-outline" size={40} color={colors.contrast} />
            <Text style={styles.iconText}>Camera</Text>
          </TouchableOpacity>
        </View>

        <AuthStackButton title={imageUri ? 'Next' : 'Skip'} onPress={handleNext} />
      </View>

      <BackgroundBuildings />
    </View>
  );
}

const createStyles = (colors: any) =>
  StyleSheet.create({
    container: {
      paddingTop: 20,
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: colors.background,
    },
    content: {
      flex: 3,
      width: '100%',
      justifyContent: 'center',
      alignItems: 'center',
      paddingHorizontal: 20,
      gap: 20,
    },
    title: {
      fontSize: 28,
      fontWeight: 'bold',
      color: colors.textPrimary,
    },
    iconRow: {
      flexDirection: 'row',
      gap: 40,
    },
    iconButton: {
      alignItems: 'center',
    },
    iconText: {
      marginTop: 5,
      color: colors.textPrimary,
      fontWeight: 'bold',
    },
    skipText: {
      marginTop: 10,
      color: colors.textSecondary,
      textDecorationLine: 'underline',
    },
  });
