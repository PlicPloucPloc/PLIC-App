import React, { memo, useEffect, useState } from 'react';
import { TouchableOpacity, View, Text, StyleSheet } from 'react-native';

import { Ionicons } from '@expo/vector-icons';

import { ColorTheme } from '@app/Colors';
import { Room } from '@app/definitions/rest/ChatService';
import { useThemeColors } from '@app/hooks/UseThemeColor';

import ProfilePicture from './ProfilePicture';

type HeaderMessageInfoProps = {
  roomInfo?: Room;
  onPressSingle?: () => void;
  onPressGroup?: () => void;
};

const IMAGE_SIZE = 50;
const BORDER_RADIUS = 10;

const HeaderMessageInfo = memo(
  ({ roomInfo, onPressSingle, onPressGroup }: HeaderMessageInfoProps) => {
    const colors = useThemeColors();
    const styles = createStyles(colors);

    const [isGroup, setIsGroup] = useState(false);
    const [title, setTitle] = useState('');

    useEffect(() => {
      if (!roomInfo) {
        return;
      }

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

    const otherUser = roomInfo
      ? roomInfo.participants[0]
      : { firstName: '', lastName: '', profilePictureUri: null, userId: '' };

    return (
      <TouchableOpacity style={styles.container} onPress={isGroup ? onPressGroup : onPressSingle}>
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
        </View>
      </TouchableOpacity>
    );
  },
);

HeaderMessageInfo.displayName = 'HeaderMessageInfo';

export default HeaderMessageInfo;

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
