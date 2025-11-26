import React, { useEffect, useState } from 'react';
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { useSelector } from 'react-redux';

import { AuthState } from '@app/definitions';
import { Room } from '@app/definitions/rest/ChatService';
import { RootState } from '@app/redux/Store';
import { getGroupMessageRooms } from '@app/rest/ChatService';
import { getOtherUserInfo } from '@app/rest/UserService';
import ProfilePicture from '@components/ProfilePicture';
import { MessageStackScreenProps } from '@navigation/Types';

export default function GroupMessageListScreen({
  navigation,
}: MessageStackScreenProps<'GroupMessageList'>) {
  const currentUserId = useSelector((state: RootState) => state.authState.userId);

  const [messages, setMessages] = useState<Room[] | null>(null);
  const [otherUserInfo, setOtherUserInfo] = useState<AuthState[] | []>([]);

  useEffect(() => {
    const fetchMessages = async () => {
      const rooms = await getGroupMessageRooms(currentUserId);

      if (!rooms) {
        setMessages(null);
        return;
      }
      const roomsWithUsers = await Promise.all(
        rooms.map(async (room) => {
          const otherUserId = room.participants_id.find((id) => id !== currentUserId);

          if (!otherUserId) {
            return { ...room, otherUser: undefined };
          }

          try {
            const others = room.participants_id.filter((id) => id !== currentUserId);
            for (let i = 0; i < others.length; i++) {
              const userInfo = await getOtherUserInfo(others[i]);
              others.push(userInfo as unknown as string);
            }
            setOtherUserInfo(others as unknown as AuthState[]);
            return { ...room, otherUser: others || undefined };
          } catch (error) {
            console.error('Error fetching user info for', otherUserId, error);
            return { ...room, otherUser: undefined };
          }
        }),
      );

      setMessages(roomsWithUsers);
    };

    fetchMessages();
  }, [currentUserId]);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Messages</Text>
        <TouchableOpacity
          style={styles.roomiesButton}
          onPress={() => navigation.navigate('DirectMessageList')}>
          <Text style={styles.roomiesText}>Direct message</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={messages}
        contentContainerStyle={{ paddingHorizontal: 16 }}
        renderItem={({ item }) => {
          const otherUser = otherUserInfo;
          const displayName = otherUser
            ? `${otherUser[0]?.firstName} ${otherUser[0]?.lastName}`
            : 'Unknown User';

          return (
            <TouchableOpacity
              style={styles.messageContainer}
              onPress={() =>
                navigation.navigate('GroupMessage', {
                  roomId: item.room_id,
                })
              }>
              <ProfilePicture
                size={48}
                imageUri={otherUserInfo[0]?.profilePictureUri ?? null}
                firstName={otherUserInfo[0]?.firstName ?? '?'}
                lastName={otherUserInfo[0]?.lastName ?? '?'}
                borderRadius={24}
              />
              <View style={styles.messageContent}>
                <View style={styles.messageHeader}>
                  <Text style={styles.name}>{displayName}</Text>
                </View>
                <Text numberOfLines={1} style={[styles.lastMessage]}>
                  {item.last_message?.message || 'No messages yet'}
                </Text>
              </View>
            </TouchableOpacity>
          );
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: 50,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
  },
  roomiesButton: {
    backgroundColor: '#D0E8FF',
    paddingVertical: 6,
    paddingHorizontal: 16,
    borderRadius: 20,
  },
  roomiesText: {
    color: '#007AFF',
    fontWeight: '600',
  },
  messageContainer: {
    flexDirection: 'row',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderColor: '#eee',
  },
  messageContent: {
    flex: 1,
    justifyContent: 'center',
    marginLeft: 12,
  },
  messageHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
  },
  lastMessage: {
    fontSize: 14,
    color: '#666',
  },
});
