import React, { memo, useEffect, useState } from 'react';
import { TouchableOpacity, View, Text, StyleSheet } from 'react-native';

import { Ionicons } from '@expo/vector-icons';

import { ColorTheme } from '@app/Colors';
import { Room } from '@app/definitions/rest/ChatService';
import { useThemeColors } from '@app/hooks/UseThemeColor';

import ProfilePicture from './ProfilePicture';

type MessageParticipantsListProps = {
  roomInfo: Room;
  onPress: () => void;
};

const IMAGE_SIZE = 60;
const BORDER_RADIUS = 10;

const MessageParticipantsList = memo(({ roomInfo, onPress }: MessageParticipantsListProps) => {
  const colors = useThemeColors();
  const styles = createStyles(colors);

  const [isGroup, setIsGroup] = useState(false);
  const [title, setTitle] = useState('');

  useEffect(() => {
    if (roomInfo.participants.length === 1) {
      setIsGroup(false);
      setTitle(`${roomInfo.participants[0].firstName} ${roomInfo.participants[0].lastName}`);
    } else {
      setIsGroup(true);

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
      {isGroup ? (
        <View
          style={[
            styles.groupImageContainer,
            {
              width: IMAGE_SIZE,
              height: IMAGE_SIZE,
              borderRadius: BORDER_RADIUS,
            },
          ]}>
          <Ionicons name="people" size={IMAGE_SIZE * 0.6} color="white" />
        </View>
      ) : (
        <ProfilePicture
          size={IMAGE_SIZE}
          imageUri={otherUser.profilePictureUri}
          firstName={otherUser.firstName}
          lastName={otherUser.lastName}
          borderRadius={BORDER_RADIUS}
        />
      )}

      <View style={styles.infoContainer}>
        <Text numberOfLines={1} style={styles.title}>
          {title}
        </Text>
        <Text numberOfLines={1} style={[styles.lastMessage]}>
          {roomInfo.last_message?.message || 'No messages yet.'}
        </Text>
      </View>
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

    groupImageContainer: {
      backgroundColor: colors.primary,
      borderWidth: 2,
      borderColor: colors.contrast,
      justifyContent: 'center',
      alignItems: 'center',
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
