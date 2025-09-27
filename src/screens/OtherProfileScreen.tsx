import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { ColorTheme } from '@app/Colors';
import { IoniconName } from '@app/definitions';
import { AuthState } from '@app/definitions/redux';
import { useThemeColors } from '@app/hooks/UseThemeColor';
import { RootState } from '@app/redux/Store';
import { getOtherUserInfo } from '@app/rest/UserService';
import ProfilePicture from '@components/ProfilePicture';
import { Ionicons } from '@expo/vector-icons';
import { SharedStackScreenProps } from '@navigation/Types';
import { useSelector } from 'react-redux';

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
      const userInfo = isCurrentUser ? authState : await getOtherUserInfo(route.params.userId);

      if (!userInfo) {
        return;
      }

      setUserInfo(userInfo);

      const age = Math.floor(
        (new Date().getTime() - new Date(userInfo.birthdate).getTime()) / 31557600000,
      ); // tkt c'est magique

      setProfileItems([
        { icon: 'person', label: 'First name', value: userInfo.firstName },
        { icon: 'person', label: 'Last name', value: userInfo.lastName },
        { icon: 'calendar', label: 'Age', value: age.toString() },
      ]);
    })();
  }, [route.params.userId, authState, isCurrentUser]);

  return (
    <View style={styles.container}>
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
        <TouchableOpacity
          onPress={() => navigation.navigate('DirectMessage', { userId: route.params.userId })}
          style={{ marginTop: 12, alignSelf: 'center' }}>
          <Text style={{ color: colors.primary, fontWeight: '600' }}>Send message</Text>
        </TouchableOpacity>
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
