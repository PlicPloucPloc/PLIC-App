import React, { useState } from 'react';
import { Alert, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { ColorTheme } from '@app/Colors';
import { useThemeColors } from '@app/hooks/UseThemeColor';
import { setProfilePicture } from '@app/redux/slices';
import store, { RootState } from '@app/redux/Store';
import ProfilePicture from '@components/ProfilePicture';
import { Ionicons } from '@expo/vector-icons';
import { AccountStackScreenProps } from '@navigation/Types';
import * as ImagePicker from 'expo-image-picker';
import { setStatusBarBackgroundColor } from 'expo-status-bar';
import Modal from 'react-native-modal';
import { useSelector } from 'react-redux';

export default function MyProfileScreen({}: AccountStackScreenProps<'MyProfile'>) {
  const colors = useThemeColors();
  const styles = createStyles(colors);

  const authState = useSelector((state: RootState) => state.authState);
  const [modalVisible, setModalVisible] = useState(false);

  const profileItems = [
    { icon: 'person', label: 'First name', value: authState.firstName },
    { icon: 'person', label: 'Last name', value: authState.lastName },
    { icon: 'calendar', label: 'Date of birth', value: authState.birthdate },
  ];

  async function handleImageSelection(source: 'camera' | 'gallery') {
    const permission =
      source === 'camera'
        ? await ImagePicker.requestCameraPermissionsAsync()
        : await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permission.granted) {
      Alert.alert('Permission required', `Please allow access to your ${source}.`);
      return;
    }

    const pickerMethod =
      source === 'camera' ? ImagePicker.launchCameraAsync : ImagePicker.launchImageLibraryAsync;

    const result = await pickerMethod({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7,
    });

    if (!result.canceled) {
      const uri = result.assets[0].uri;
      setModalVisible(false);
      store.dispatch(setProfilePicture(uri));
    }
  }

  function showModal(show: boolean) {
    setModalVisible(show);
    // store.dispatch(setStatusBarBackgroundColor(show));
    setStatusBarBackgroundColor(show ? 'rgba(0,0,0,0.5)' : 'transparent', false);
  }

  return (
    <View style={styles.container}>
      <Modal
        isVisible={modalVisible}
        onBackdropPress={() => showModal(false)}
        onBackButtonPress={() => showModal(false)}
        hideModalContentWhileAnimating={true}
        animationInTiming={300}
        animationOutTiming={300}
        backdropTransitionOutTiming={1}
        backdropTransitionInTiming={1}
        backdropOpacity={0.5}
        swipeDirection={['down']}
        onSwipeComplete={() => showModal(false)}
        style={{ margin: 0 }}>
        <View style={styles.modalView}>
          <View style={styles.modalSwipeIndicator} />

          <View style={styles.modalHeaderContainer}>
            <Ionicons
              name="close"
              size={26}
              color={colors.textPrimary}
              onPress={() => showModal(false)}
            />
            <Text style={styles.modalTitle}>Change Profile Picture</Text>
            <Ionicons name="close" size={24} style={{ opacity: 0 }} />
          </View>

          <TouchableOpacity
            style={styles.buttonRow}
            onPress={() => handleImageSelection('gallery')}>
            <Ionicons name="images" size={24} color={colors.textSecondary} />
            <Text style={styles.modaltext}>Gallery</Text>
          </TouchableOpacity>

          <View style={styles.separator} />

          <TouchableOpacity style={styles.buttonRow} onPress={() => handleImageSelection('camera')}>
            <Ionicons name="camera" size={24} color={colors.textSecondary} />
            <Text style={styles.modaltext}>Camera</Text>
          </TouchableOpacity>
        </View>
      </Modal>

      <TouchableOpacity onPress={() => showModal(true)} style={styles.avatarContainer}>
        <ProfilePicture size={200} imageUri={authState.profilePicture} borderRadius={30} />
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
      backgroundColor: colors.background,
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
      color: colors.textSecondary,
      fontSize: 15,
      fontWeight: '500',
      marginLeft: 15,
    },
  });
