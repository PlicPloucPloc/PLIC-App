import React, { useEffect, useState } from 'react';
import { FlatList, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { GetRoomResponse } from '@app/definitions/rest/ChatService';
import { getRooms } from '@app/rest/ChatService';
import { MessageStackScreenProps } from '@navigation/Types';

export default function DirectMessageListScreen({
  navigation,
}: MessageStackScreenProps<'DirectMessageList'>) {
  const [messages, setMessages] = useState<GetRoomResponse[] | null>(null);

  useEffect(() => {
    const fetchMessages = async () => {
      const rooms = await getRooms();
      console.log('ROOMS', rooms);
      setMessages(rooms);
    };

    fetchMessages();
  }, []);

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
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.messageContainer}
            onPress={() =>
              navigation.navigate('SharedStack', {
                screen: 'DirectMessage',
                params: { roomId: item.room_id },
              })
            }>
            <Image source={{ uri: 'https://i.pravatar.cc/100?img=1' }} style={styles.avatar} />
            <View style={styles.messageContent}>
              <View style={styles.messageHeader}>
                <Text style={styles.name}>{item.participants_id.join(', ')}</Text>
              </View>
              <Text numberOfLines={1} style={[styles.lastMessage]}>
                {item.last_message}
              </Text>
            </View>
          </TouchableOpacity>
        )}
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
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    marginRight: 12,
  },
  messageContent: {
    flex: 1,
    justifyContent: 'center',
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
