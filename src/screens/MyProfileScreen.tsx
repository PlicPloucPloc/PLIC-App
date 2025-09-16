import React, { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { ColorTheme } from '@app/Colors';
import { useThemeColors } from '@app/hooks/UseThemeColor';
import { setProfilePictureUri } from '@app/redux/slices';
import store, { RootState } from '@app/redux/Store';
import { deleteProfilePicture, putProfilePicture } from '@app/rest/S3Service';
import { fetchAndCompressImage, selectImageFromMedia } from '@app/utils/Image';
import Loader from '@components/Loader';
import ProfilePicture from '@components/ProfilePicture';
import { Ionicons } from '@expo/vector-icons';
import { AccountStackScreenProps } from '@navigation/Types';
import Modal from 'react-native-modal';
import { useSelector } from 'react-redux';

export default function MyProfileScreen({}: AccountStackScreenProps<'MyProfile'>) {
  const colors = useThemeColors();
  const styles = createStyles(colors);

  const authState = useSelector((state: RootState) => state.authState);
  const [modalVisible, setModalVisible] = useState(false);

  const [isLoading, setIsLoading] = useState(false);

  const profileItems = [
    { icon: 'person', label: 'First name', value: authState.firstName },
    { icon: 'person', label: 'Last name', value: authState.lastName },
    { icon: 'calendar', label: 'Date of birth', value: authState.birthdate },
  ];

  const handleImageSelection = (source: 'camera' | 'gallery') =>
    selectImageFromMedia(source, async (uri: string) => {
      await uploadImage(uri);
    });

  async function uploadImage(uri: string) {
    setIsLoading(true);
    const image = await fetchAndCompressImage(uri);

    if (!image) {
      return false;
    }

    store.dispatch(setProfilePictureUri(image.uri));

    await putProfilePicture(`${authState.userId}.png`, image.blob);
    setIsLoading(false);
    setModalVisible(false);
  }

  async function handleRemoveImage() {
    store.dispatch(setProfilePictureUri(null));

    setIsLoading(true);
    await deleteProfilePicture(`${authState.userId}.png`);
    setIsLoading(false);
    setModalVisible(false);
  }

  return (
    <View style={styles.container}>
      <Modal
        isVisible={modalVisible}
        onBackdropPress={() => setModalVisible(false)}
        onBackButtonPress={() => setModalVisible(false)}
        hideModalContentWhileAnimating={true}
        animationInTiming={300}
        animationOutTiming={300}
        backdropTransitionOutTiming={1}
        backdropTransitionInTiming={1}
        backdropOpacity={0}
        swipeDirection={['down']}
        onSwipeComplete={() => setModalVisible(false)}
        style={{ margin: 0 }}>
        <Loader loading={isLoading} />
        <View style={styles.modalView}>
          <View style={styles.modalSwipeIndicator} />

          <View style={styles.modalHeaderContainer}>
            <Ionicons
              name="close"
              size={26}
              color={colors.textPrimary}
              onPress={() => setModalVisible(false)}
            />
            <Text style={styles.modalTitle}>Change Profile Picture</Text>
            <Ionicons name="close" size={24} style={{ opacity: 0 }} />
          </View>

          <TouchableOpacity
            style={styles.buttonRow}
            onPress={() => handleImageSelection('gallery')}>
            <Ionicons name="images" size={24} color={colors.textPrimary} />
            <Text style={styles.modaltext}>Choose from gallery</Text>
          </TouchableOpacity>

          <View style={styles.separator} />

          <TouchableOpacity style={styles.buttonRow} onPress={() => handleImageSelection('camera')}>
            <Ionicons name="camera" size={24} color={colors.textPrimary} />
            <Text style={styles.modaltext}>Take a picture</Text>
          </TouchableOpacity>

          <View style={styles.separator} />

          <TouchableOpacity
            style={styles.buttonRow}
            onPress={() => handleRemoveImage()}
            disabled={!authState.profilePictureUri}>
            <Ionicons
              name="trash"
              size={24}
              color={authState.profilePictureUri ? colors.textPrimary : colors.textSecondary}
            />
            <Text
              style={[
                styles.modaltext,
                authState.profilePictureUri ? {} : { color: colors.textSecondary },
              ]}>
              Delete profile picture
            </Text>
          </TouchableOpacity>
        </View>
      </Modal>

      <TouchableOpacity onPress={() => setModalVisible(true)} style={styles.avatarContainer}>
        <ProfilePicture size={200} imageUri={authState.profilePictureUri} borderRadius={30} />
      </TouchableOpacity>

      <View style={styles.infoContainer}>
        {profileItems.map((item, index) => (
          <View key={index} style={styles.itemRow}>
            <Ionicons name={item.icon as any} size={22} color={colors.textSecondary} />
            <View style={styles.itemTextContainer}>
              <Text style={styles.label}>{item.label}</Text>
              <Text style={styles.value}>{item.value}</Text>
            </View>
          </View>
        ))}
      </View>
    </View>
  );
}

const createStyles = (colors: ColorTheme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      paddingHorizontal: 15,
      backgroundColor: colors.background,
    },
    avatarContainer: {
      marginTop: 10,
      alignItems: 'center',
      justifyContent: 'center',
    },
    editButton: {
      marginTop: 8,
    },
    infoContainer: {
      marginTop: 40,
      width: '90%',
    },
    itemRow: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: 18,
      borderBottomWidth: StyleSheet.hairlineWidth,
      borderBottomColor: colors.contrast,
    },
    itemTextContainer: {
      marginLeft: 15,
    },
    label: {
      fontSize: 14,
      color: colors.textSecondary,
      marginBottom: 4,
    },
    value: {
      fontSize: 16,
      color: colors.textPrimary,
    },

    modalView: {
      position: 'absolute',
      bottom: 0,
      width: '100%',
      height: '99%',
      backgroundColor: colors.backgroundSecondary,
      paddingHorizontal: 20,
      paddingBottom: 30,
      paddingTop: 5,
      borderTopRightRadius: 20,
      borderTopLeftRadius: 20,
    },
    modalSwipeIndicator: {
      width: '10%',
      height: 5,
      backgroundColor: colors.contrast,
      borderRadius: 5,
      alignSelf: 'center',
      marginBottom: 15,
    },
    modalHeaderContainer: {
      flexDirection: 'row',
      justifyContent: 'space-around',
      marginTop: 10,
    },
    modalTitle: {
      color: colors.textPrimary,
      fontSize: 18,
      fontWeight: '600',
      marginBottom: 23,
      textAlign: 'center',
    },
    buttonRow: {
      width: '100%',
      paddingHorizontal: 15,
      paddingVertical: 10,
      flexDirection: 'row',
      justifyContent: 'flex-start',
    },
    separator: {
      width: '100%',
      marginVertical: 10,
      borderBottomWidth: StyleSheet.hairlineWidth,
      borderBottomColor: colors.contrast,
    },
    modaltext: {
      color: colors.textPrimary,
      fontSize: 15,
      fontWeight: '500',
      marginLeft: 15,
    },
  });
