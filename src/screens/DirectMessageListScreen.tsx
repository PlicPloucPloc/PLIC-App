import React, { useEffect, useState } from 'react';
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { useSelector } from 'react-redux';

import { AuthState } from '@app/definitions';
import { GetRoomResponse } from '@app/definitions/rest/ChatService';
import { RootState } from '@app/redux/Store';
import { getRooms } from '@app/rest/ChatService';
import { getOtherUserInfo } from '@app/rest/UserService';
import ProfilePicture from '@components/ProfilePicture';
import { MessageStackScreenProps } from '@navigation/Types';

type RoomWithUserInfo = GetRoomResponse & {
  otherUser?: AuthState;
};

export default function DirectMessageListScreen({
  navigation,
}: MessageStackScreenProps<'DirectMessageList'>) {
  const [messages, setMessages] = useState<RoomWithUserInfo[] | null>(null);
  const currentUserId = useSelector((state: RootState) => state.authState.userId);

  useEffect(() => {
    const fetchMessages = async () => {
      const rooms = await getRooms();
      console.log('ROOMS', rooms);

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
            const userInfo = await getOtherUserInfo(otherUserId);
            return { ...room, otherUser: userInfo || undefined };
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
          onPress={() => navigation.navigate('GroupMessageList')}>
          <Text style={styles.roomiesText}>Roomies</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={messages}
        contentContainerStyle={{ paddingHorizontal: 16 }}
        renderItem={({ item }) => {
          const otherUser = item.otherUser;
          const displayName = otherUser
            ? `${otherUser.firstName} ${otherUser.lastName}`
            : 'Unknown User';

          return (
            <TouchableOpacity
              style={styles.messageContainer}
              onPress={() =>
                navigation.navigate('SharedStack', {
                  screen: 'DirectMessage',
                  params: { roomId: item.room_id },
                })
              }>
              <ProfilePicture
                size={48}
                imageUri={otherUser?.profilePictureUri ?? null}
                firstName={otherUser?.firstName ?? '?'}
                lastName={otherUser?.lastName ?? '?'}
                borderRadius={24}
              />
              <View style={styles.messageContent}>
                <View style={styles.messageHeader}>
                  <Text style={styles.name}>{displayName}</Text>
                </View>
                <Text numberOfLines={1} style={[styles.lastMessage]}>
                  {item.last_message || 'No messages yet'}
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
