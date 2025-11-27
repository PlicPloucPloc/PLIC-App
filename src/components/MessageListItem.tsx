import React, { memo, useEffect, useState } from 'react';
import { TouchableOpacity, View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { ColorTheme } from '@app/Colors';
import { Room } from '@app/definitions/rest/ChatService';
import { useThemeColors } from '@app/hooks/UseThemeColor';

import ProfilePicture from './ProfilePicture';

type MessageListItemProps = {
  roomInfo: Room;
  onPress: () => void;
};

const MessageListItem = memo(({ roomInfo, onPress }: MessageListItemProps) => {
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

      const first_two_names = roomInfo.participants
        .slice(0, 2)
        .map((user) => `${user.firstName} ${user.lastName}`)
        .join(', ');

      if (roomInfo.participants.length > 2) {
        setTitle(`${first_two_names}, and ${roomInfo.participants.length - 2} others`);
      } else {
        setTitle(first_two_names);
      }
    }
  }, [roomInfo]);

  const otherUser = roomInfo.participants[0];

  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      {isGroup ? (
        <View style={styles.groupImageContainer}>
          <Ionicons name="people" size={36} color="white" />
        </View>
      ) : (
        <ProfilePicture
          size={60}
          imageUri={otherUser.profilePictureUri}
          firstName={otherUser.firstName}
          lastName={otherUser.lastName}
          borderRadius={10}
        />
      )}

      <View style={styles.infoContainer}>
        <Text style={styles.title}>{title}</Text>
        <Text numberOfLines={1} style={[styles.lastMessage]}>
          {roomInfo.last_message?.message || 'No messages yet.'}
        </Text>
      </View>
    </TouchableOpacity>
  );
});

MessageListItem.displayName = 'MessageListItem';

export default MessageListItem;

const createStyles = (colors: ColorTheme) =>
  StyleSheet.create({
    container: {
      flexDirection: 'row',
      paddingVertical: 12,
    },

    groupImageContainer: {
      backgroundColor: colors.primary,
      borderWidth: 2,
      borderColor: colors.contrast,
      justifyContent: 'center',
      alignItems: 'center',
      width: 60,
      height: 60,
      borderRadius: 10,
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
