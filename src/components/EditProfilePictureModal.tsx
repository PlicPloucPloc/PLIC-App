import { useEffect, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { ColorTheme } from '@app/Colors';
import { useThemeColors } from '@app/hooks/UseThemeColor';
import { setProfilePictureUri } from '@app/redux/slices';
import store, { RootState } from '@app/redux/Store';
import { deleteProfilePicture, putProfilePicture } from '@app/rest/S3Service';
import { fetchAndCompressImage, selectImageFromMedia } from '@app/utils/Image';
import Loader from '@components/Loader';
import { Ionicons } from '@expo/vector-icons';
import { useSelector } from 'react-redux';

import BottomPopupEditorModal from './BottomPopupEditorModal';
import ProfilePicture from './ProfilePicture';

type EditProfilePictureModalProps = {
  modalVisible: boolean;
  setModalVisible: (visible: boolean) => void;
};

export default function EditProfilePictureModal({
  modalVisible,
  setModalVisible,
}: EditProfilePictureModalProps) {
  const colors = useThemeColors();
  const styles = createStyles(colors);

  const [isLoading, setIsLoading] = useState(false);
  const authState = useSelector((state: RootState) => state.authState);

  const [imageUri, setImageUri] = useState<string | null>(authState.profilePictureUri);

  useEffect(() => {
    if (!modalVisible) {
      return;
    }

    setImageUri(authState.profilePictureUri);
  }, [modalVisible, authState]);

  const hasChanges = () => imageUri !== authState.profilePictureUri;

  const handleImageSelection = (source: 'camera' | 'gallery') =>
    selectImageFromMedia(source, async (uri: string) => {
      setImageUri(uri);
    });

  async function handleDone() {
    if (!hasChanges()) {
      return setModalVisible(false);
    }

    setIsLoading(true);

    if (imageUri === null) {
      store.dispatch(setProfilePictureUri(null));
      await deleteProfilePicture(`${authState.userId}.png`);
    } else {
      const image = await fetchAndCompressImage(imageUri);
      if (!image) {
        return false;
      }

      store.dispatch(setProfilePictureUri(image.uri));
      await putProfilePicture(`${authState.userId}.png`, image.blob);
    }

    setIsLoading(false);
    setModalVisible(false);
  }

  return (
    <BottomPopupEditorModal
      modalVisible={modalVisible}
      setModalVisible={setModalVisible}
      title={'Change profile picture'}
      hasChanges={hasChanges}
      handleDone={handleDone}>
      <Loader loading={isLoading} />

      <View style={{ alignItems: 'center', marginBottom: 20 }}>
        <ProfilePicture size={250} imageUri={imageUri} borderRadius={30} />
      </View>

      <TouchableOpacity style={styles.buttonRow} onPress={() => handleImageSelection('gallery')}>
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
        onPress={() => setImageUri(null)}
        disabled={!imageUri}>
        <Ionicons
          name="trash"
          size={24}
          color={imageUri ? colors.textPrimary : colors.textSecondary}
        />
        <Text style={[styles.modaltext, imageUri ? {} : { color: colors.textSecondary }]}>
          Delete profile picture
        </Text>
      </TouchableOpacity>
    </BottomPopupEditorModal>
  );
}

const createStyles = (colors: ColorTheme) =>
  StyleSheet.create({
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
