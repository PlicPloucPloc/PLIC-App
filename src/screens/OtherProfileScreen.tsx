import React, { useState } from 'react';
import { Alert, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { Ionicons } from '@expo/vector-icons';
import { useSelector } from 'react-redux';

import { ColorTheme } from '@app/Colors';
import { IoniconName } from '@app/definitions';
import { CreateRoomRequest } from '@app/definitions/rest/ChatService';
import { useThemeColors } from '@app/hooks/UseThemeColor';
import { RootState } from '@app/redux/Store';
import { createAndGetRoom } from '@app/rest/ChatService';
import { calculateAge } from '@app/utils/Misc';
import BottomPopupModal from '@components/BottomPopupModal';
import ProfilePicture from '@components/ProfilePicture';
import { SharedStackScreenProps } from '@navigation/Types';

import AddToARoom from './AddToARoom';

type ProfileItem = {
  icon: IoniconName;
  label: string;
  value: string;
};

export default function OtherProfileScreen({
  navigation,
  route,
}: SharedStackScreenProps<'OtherProfile'>) {
  const colors = useThemeColors();
  const styles = createStyles(colors);

  const authState = useSelector((state: RootState) => state.authState);

  const [modalVisible, setModalVisible] = useState(false);

  const isCurrentUser = authState.userId === route.params.user.userId;

  const profileItems: ProfileItem[] = [
    { icon: 'person', label: 'First name', value: route.params.user.firstName },
    { icon: 'person', label: 'Last name', value: route.params.user.lastName },
    { icon: 'calendar', label: 'Age', value: calculateAge(route.params.user.birthdate).toString() },
  ];

  async function createRoom() {
    const roomRequest: CreateRoomRequest = {
      users: [route.params.user.userId],
      apartment_id: null,
      owner_id: authState.userId,
    };

    const room = await createAndGetRoom(authState.userId, roomRequest);
    if (!room) {
      return Alert.alert(
        'Something went wrong.',
        'We were unable to create a chat with this user.\nPlease try again later.',
      );
    }

    navigation.navigate('Message', { roomInfo: room });
  }

  console.log('OtherProfileScreen', route.params.user);
  return (
    <View style={styles.container}>
      <BottomPopupModal
        modalVisible={modalVisible}
        setModalVisible={setModalVisible}
        title="Add to a group chat"
        subtitle="Select a group chat to add this user to.">
        <AddToARoom
          afterAdd={(roomInfo) => {
            navigation.navigate('Message', { roomInfo: roomInfo });
            setModalVisible(false);
          }}
          user={route.params.user}
        />
      </BottomPopupModal>

      <View style={styles.pictureContainer}>
        <ProfilePicture
          size={200}
          imageUri={route.params.user.profilePictureUri}
          firstName={route.params.user.firstName}
          lastName={route.params.user.lastName}
          borderRadius={30}
        />
      </View>

      {!isCurrentUser && (
        <View>
          <TouchableOpacity onPress={createRoom} style={{ marginTop: 12, alignSelf: 'center' }}>
            <Text style={{ color: colors.primary, fontWeight: '600' }}>Send message</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setModalVisible(true)}
            style={{ marginTop: 8, alignSelf: 'center' }}>
            <Text style={{ color: colors.primary, fontWeight: '600' }}>Add to a group chat</Text>
          </TouchableOpacity>
        </View>
      )}

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
