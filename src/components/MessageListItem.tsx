import { memo } from 'react';
import { TouchableOpacity, View, Text, StyleSheet } from 'react-native';

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

  const otherUser = roomInfo.participants[0];

  return (
    <TouchableOpacity style={styles.messageContainer} onPress={onPress}>
      <ProfilePicture
        size={48}
        imageUri={otherUser.profilePictureUri}
        firstName={otherUser.firstName}
        lastName={otherUser.lastName}
        borderRadius={24}
      />
      <View style={styles.messageContent}>
        <Text style={styles.name}>
          {otherUser.firstName} {otherUser.lastName}
        </Text>
        <Text numberOfLines={1} style={[styles.lastMessage]}>
          {roomInfo.last_message || 'No messages yet.'}
        </Text>
      </View>
    </TouchableOpacity>
  );
});

MessageListItem.displayName = 'MessageListItem';

export default MessageListItem;

const createStyles = (colors: ColorTheme) =>
  StyleSheet.create({
    messageContainer: {
      flexDirection: 'row',
      paddingVertical: 12,
    },
    messageContent: {
      flex: 1,
      justifyContent: 'space-evenly',
      marginLeft: 12,
    },
    name: {
      color: colors.textPrimary,
      fontSize: 16,
      fontWeight: '600',
    },
    lastMessage: {
      fontSize: 14,
      color: colors.textSecondary,
    },
  });
