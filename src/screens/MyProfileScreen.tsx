import React, { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { Ionicons } from '@expo/vector-icons';
import { useSelector } from 'react-redux';

import { ColorTheme } from '@app/Colors';
import { IoniconName } from '@app/definitions';
import { useThemeColors } from '@app/hooks/UseThemeColor';
import { RootState } from '@app/redux/Store';
import EditProfileInformationModal from '@components/EditProfileInformationModal';
import EditProfilePictureModal from '@components/EditProfilePictureModal';
import ProfilePicture from '@components/ProfilePicture';
import { AccountStackScreenProps } from '@navigation/Types';

type ProfileItem = {
  icon: IoniconName;
  label: string;
  value: string;
};

export default function MyProfileScreen(_: AccountStackScreenProps<'MyProfile'>) {
  const colors = useThemeColors();
  const styles = createStyles(colors);

  const authState = useSelector((state: RootState) => state.authState);
  const [pictureModalVisible, setPictureModalVisible] = useState(false);
  const [infoModalVisible, setInfoModalVisible] = useState(false);

  const profileItems: ProfileItem[] = [
    { icon: 'person', label: 'First name', value: authState.firstName },
    { icon: 'person', label: 'Last name', value: authState.lastName },
    { icon: 'calendar', label: 'Date of birth', value: authState.birthdate },
  ];

  return (
    <View style={styles.container}>
      {/* Modals */}
      <EditProfilePictureModal
        modalVisible={pictureModalVisible}
        setModalVisible={setPictureModalVisible}
      />

      <EditProfileInformationModal
        modalVisible={infoModalVisible}
        setModalVisible={setInfoModalVisible}
      />

      {/* MyProfile page */}
      <TouchableOpacity
        onPress={() => setPictureModalVisible(true)}
        style={styles.pictureContainer}>
        <ProfilePicture
          size={200}
          imageUri={authState.profilePictureUri}
          firstName={authState.firstName}
          lastName={authState.lastName}
          borderRadius={30}
        />
      </TouchableOpacity>

      <View style={{ marginTop: 6, borderRadius: 1000, alignSelf: 'center' }}>
        <TouchableOpacity
          onPress={() => setPictureModalVisible(true)}
          hitSlop={10}
          style={styles.button}>
          <Text style={styles.buttonText}>Edit profile picture</Text>
        </TouchableOpacity>
      </View>

      {profileItems.map((item, index) => (
        <View
          key={index}
          style={[styles.itemRow, index != profileItems.length - 1 ? styles.bottomBorder : {}]}>
          <Ionicons name={item.icon} size={22} color={colors.textSecondary} />
          <View style={{ marginLeft: 15 }}>
            <Text style={styles.label}>{item.label}</Text>
            <Text style={styles.value}>{item.value}</Text>
          </View>
        </View>
      ))}

      <TouchableOpacity
        onPress={() => setInfoModalVisible(true)}
        hitSlop={10}
        style={styles.button}>
        <Text style={styles.buttonText}>Edit personal information</Text>
      </TouchableOpacity>
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
    pictureContainer: {
      marginTop: 10,
      alignItems: 'center',
    },

    button: {
      alignSelf: 'center',
      paddingVertical: 7,
      paddingHorizontal: 12,
    },
    buttonText: {
      color: colors.primary,
      fontSize: 14,
    },

    itemRow: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: 18,
    },
    bottomBorder: {
      borderBottomWidth: StyleSheet.hairlineWidth,
      borderBottomColor: colors.contrast,
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
  });
