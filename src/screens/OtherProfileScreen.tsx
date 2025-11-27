import React, { useEffect, useState } from 'react';
import { Alert, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { Ionicons } from '@expo/vector-icons';
import { useSelector } from 'react-redux';

import { ColorTheme } from '@app/Colors';
import { IoniconName, AuthState } from '@app/definitions';
import { CreateRoomRequest } from '@app/definitions/rest/ChatService';
import { useThemeColors } from '@app/hooks/UseThemeColor';
import { RootState } from '@app/redux/Store';
import { createAndGetRoom, createRoom } from '@app/rest/ChatService';
import { getOtherUserInfo } from '@app/rest/UserService';
import { calculateAge } from '@app/utils/Misc';
import Loader from '@components/Loader';
import ProfilePicture from '@components/ProfilePicture';
import { SharedStackScreenProps } from '@navigation/Types';

type ProfileItem = {
  icon: IoniconName;
  label: string;
  value: string;
};

const defaultProfileItems: ProfileItem[] = [
  { icon: 'person', label: 'First name', value: '...' },
  { icon: 'person', label: 'Last name', value: '...' },
  { icon: 'calendar', label: 'Age', value: '...' },
];

export default function OtherProfileScreen({
  navigation,
  route,
}: SharedStackScreenProps<'OtherProfile'>) {
  const colors = useThemeColors();
  const styles = createStyles(colors);

  const [loading, setLoading] = useState(true);

  const [profileItems, setProfileItems] = useState<ProfileItem[]>(defaultProfileItems);
  const [userInfo, setUserInfo] = useState<AuthState>({
    firstName: '...',
    lastName: '...',
    profilePictureUri: null,
  } as AuthState);

  const authState = useSelector((state: RootState) => state.authState);
  const isCurrentUser = authState.userId === route.params.userId;

  useEffect(() => {
    (async () => {
      let userInfo;

      if (isCurrentUser) {
        setLoading(false);
        userInfo = authState;
      } else {
        setLoading(true);
        userInfo = await getOtherUserInfo(route.params.userId).finally(() => setLoading(false));

        if (!userInfo) {
          return Alert.alert(
            'Something went wrong.',
            "We were unable to get this user's information.\nPlease try again later.",
          );
        }
      }

      setUserInfo(userInfo);

      const age = calculateAge(userInfo.birthdate);

      setProfileItems([
        { icon: 'person', label: 'First name', value: userInfo.firstName },
        { icon: 'person', label: 'Last name', value: userInfo.lastName },
        { icon: 'calendar', label: 'Age', value: age.toString() },
      ]);
    })();
  }, [route.params.userId, authState, isCurrentUser]);

  async function createRoom() {
    const roomRequest: CreateRoomRequest = {
      users: [route.params.userId],
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

    navigation.navigate('DirectMessage', { roomInfo: room });
  }

  return (
    <View style={styles.container}>
      <Loader loading={loading} />
      <View style={styles.pictureContainer}>
        <ProfilePicture
          size={200}
          imageUri={userInfo.profilePictureUri}
          firstName={userInfo.firstName}
          lastName={userInfo.lastName}
          borderRadius={30}
        />
      </View>

      {!isCurrentUser && (
        <View>
          <TouchableOpacity onPress={createRoom} style={{ marginTop: 12, alignSelf: 'center' }}>
            <Text style={{ color: colors.primary, fontWeight: '600' }}>Send message</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              navigation.navigate('AddToARoom', { userId: route.params.userId });
            }}
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
