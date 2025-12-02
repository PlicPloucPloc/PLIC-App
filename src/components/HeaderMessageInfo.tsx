import React, { memo, useEffect, useState } from 'react';
import { Image, TouchableOpacity, View, Text, StyleSheet, ActivityIndicator } from 'react-native';

import { Ionicons } from '@expo/vector-icons';
import { StackNavigationProp } from '@react-navigation/stack';

import { ColorTheme } from '@app/Colors';
import { ApartmentInfo, AuthState } from '@app/definitions';
import { Room } from '@app/definitions/rest/ChatService';
import { useThemeColors } from '@app/hooks/UseThemeColor';
import { getApartmentInfoById } from '@app/rest/ApartmentService';
import { SharedStackParamList } from '@navigation/Types';

import ProfilePicture from './ProfilePicture';

type HeaderMessageInfoProps = {
  roomInfo?: Room;
  navigation?: StackNavigationProp<SharedStackParamList>;
};

enum ChatRoomType {
  APARTMENT = 'apartment',
  DIRECT = 'direct',
  GROUP = 'group',
}

const IMAGE_SIZE = 50;
const BORDER_RADIUS = 10;

const HeaderMessageInfo = memo(({ roomInfo, navigation }: HeaderMessageInfoProps) => {
  const colors = useThemeColors();
  const styles = createStyles(colors);

  const [type, setType] = useState<ChatRoomType>(ChatRoomType.DIRECT);
  const [apartment, setApartment] = useState<ApartmentInfo | undefined>();
  const [isGroup, setIsGroup] = useState(false);
  const [title, setTitle] = useState('');

  useEffect(() => {
    if (!roomInfo) {
      return;
    }

    setIsGroup(roomInfo.participants.length > 1);

    if (roomInfo.apartment_id) {
      // ===== Apartment mode =====
      setType(ChatRoomType.APARTMENT);
      getApartmentInfoById(roomInfo.apartment_id).then((apartment) => {
        if (apartment) {
          setTitle(apartment.name);
          setApartment(apartment);
        }
      });
    } else if (roomInfo.participants.length === 1) {
      // ===== Direct message mode =====
      setType(ChatRoomType.DIRECT);
      setTitle(`${roomInfo.participants[0].firstName} ${roomInfo.participants[0].lastName}`);
    } else {
      // ===== Group message mode =====
      setType(ChatRoomType.GROUP);

      let first_two_names = roomInfo.participants
        .slice(0, 2)
        .map((user) => `${user.firstName} ${user.lastName}`)
        .join(', ');

      if (roomInfo.participants.length > 2) {
        first_two_names += `, and ${roomInfo.participants.length - 2} others`;
      }

      setTitle(first_two_names);
    }
  }, [roomInfo]);

  const otherUser = roomInfo
    ? roomInfo.participants[0]
    : ({ firstName: '', lastName: '', profilePictureUri: null } as AuthState);

  return (
    <TouchableOpacity
      style={styles.container}
      disabled={!roomInfo}
      onPress={() => {
        if (type === ChatRoomType.APARTMENT && apartment) {
          navigation?.navigate('ApartmentDetails', { apartment: apartment });
        } else if (type === ChatRoomType.DIRECT && roomInfo) {
          navigation?.navigate('OtherProfile', { user: roomInfo.participants[0] });
        } else if (type === ChatRoomType.GROUP && roomInfo) {
          navigation?.navigate('GroupInfo', { roomInfo: roomInfo });
        }
      }}>
      {type === ChatRoomType.APARTMENT &&
        (!apartment ? (
          <ActivityIndicator size="small" color={colors.primary} />
        ) : (
          <Image
            source={{ uri: apartment?.image_thumbnail || undefined }}
            style={styles.image}
            resizeMode="cover"
          />
        ))}

      {type === ChatRoomType.DIRECT && (
        <ProfilePicture
          size={IMAGE_SIZE}
          imageUri={otherUser.profilePictureUri}
          firstName={otherUser.firstName}
          lastName={otherUser.lastName}
          borderRadius={BORDER_RADIUS}
        />
      )}

      {type === ChatRoomType.GROUP && (
        <View style={styles.image}>
          <Ionicons name="people" size={IMAGE_SIZE * 0.6} color={colors.secondary} />
        </View>
      )}

      <View style={styles.infoContainer}>
        <Text numberOfLines={1} style={styles.title}>
          {title}
        </Text>
      </View>

      {type === ChatRoomType.APARTMENT && isGroup && (
        <TouchableOpacity
          style={{ padding: 15, marginLeft: 8 }}
          onPress={() => {
            if (roomInfo) {
              navigation?.navigate('GroupInfo', { roomInfo: roomInfo, apartment: apartment });
            }
          }}>
          <Ionicons
            name="people"
            size={28}
            color={colors.contrast}
            style={{ alignSelf: 'center' }}
          />
        </TouchableOpacity>
      )}
    </TouchableOpacity>
  );
});

HeaderMessageInfo.displayName = 'HeaderMessageInfo';

export default HeaderMessageInfo;

const createStyles = (colors: ColorTheme) =>
  StyleSheet.create({
    container: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingRight: 8,
      flex: 1,
    },

    image: {
      backgroundColor: colors.primary,
      justifyContent: 'center',
      alignItems: 'center',
      borderWidth: 2,
      borderColor: colors.contrast,
      width: IMAGE_SIZE,
      height: IMAGE_SIZE,
      borderRadius: BORDER_RADIUS,
    },

    infoContainer: {
      flex: 1,
      marginLeft: 12,
    },
    title: {
      color: colors.textPrimary,
      fontSize: 16,
      fontWeight: '600',
    },
  });
