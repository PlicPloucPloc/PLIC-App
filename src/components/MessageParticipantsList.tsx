import React, { memo, useEffect, useState } from 'react';
import { Image, TouchableOpacity, View, Text, StyleSheet } from 'react-native';

import { Ionicons } from '@expo/vector-icons';

import { ColorTheme } from '@app/Colors';
import { Room } from '@app/definitions/rest/ChatService';
import { useThemeColors } from '@app/hooks/UseThemeColor';
import { getApartmentInfoById } from '@app/rest/ApartmentService';

import ProfilePicture from './ProfilePicture';

type MessageParticipantsListProps = {
  roomInfo: Room;
  onPress: () => void;
};

enum ChatRoomType {
  APARTMENT = 'apartment',
  DIRECT = 'direct',
  GROUP = 'group',
}

const IMAGE_SIZE = 60;
const BORDER_RADIUS = 10;

const MessageParticipantsList = memo(({ roomInfo, onPress }: MessageParticipantsListProps) => {
  const colors = useThemeColors();
  const styles = createStyles(colors);

  const [type, setType] = useState<ChatRoomType>(ChatRoomType.DIRECT);
  const [isGroup, setIsGroup] = useState(false);
  const [aptThumbnailUri, setAptThumbnailUri] = useState<string | null>(null);
  const [title, setTitle] = useState('');

  useEffect(() => {
    setIsGroup(roomInfo.participants.length > 1);

    if (roomInfo.apartment_id) {
      // ===== Apartment mode =====
      setType(ChatRoomType.APARTMENT);
      getApartmentInfoById(roomInfo.apartment_id).then((apartment) => {
        if (apartment) {
          setTitle(apartment.name);
          setAptThumbnailUri(apartment.image_thumbnail);
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

  const otherUser = roomInfo.participants[0];

  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      {type === ChatRoomType.APARTMENT && (
        <Image
          source={{ uri: aptThumbnailUri || undefined }}
          style={styles.image}
          resizeMode="cover"
        />
      )}

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
        <Text numberOfLines={1} style={[styles.lastMessage]}>
          {roomInfo.last_message?.message || 'No messages yet.'}
        </Text>
      </View>

      {isGroup && (
        <View style={{ alignItems: 'center', justifyContent: 'center', marginLeft: 8 }}>
          <Ionicons name="people" size={24} color={colors.textPrimary} />
          <Text style={{ color: colors.textPrimary, fontSize: 12 }}>
            {roomInfo.participants.length} members
          </Text>
        </View>
      )}
    </TouchableOpacity>
  );
});

MessageParticipantsList.displayName = 'MessageParticipantsList';

export default MessageParticipantsList;

const createStyles = (colors: ColorTheme) =>
  StyleSheet.create({
    container: {
      flexDirection: 'row',
      paddingVertical: 8,
      paddingRight: 8,
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
      justifyContent: 'space-evenly',
      marginLeft: 12,
    },
    title: {
      color: colors.textPrimary,
      fontSize: 16,
      fontWeight: '600',
    },
    lastMessage: {
      fontSize: 14,
      color: colors.textSecondary,
    },
  });
