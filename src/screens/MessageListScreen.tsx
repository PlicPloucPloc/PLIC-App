import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import { MessageStackScreenProps } from '@navigation/Types';

type MessageItem = {
  id: string;
  name: string;
  lastMessage: string;
  time: string;
  avatar: string;
  unread?: boolean;
};

export default function MessageListScreen({ navigation }: MessageStackScreenProps<'MessageList'>) {
  const [messages, setMessages] = useState<MessageItem[] | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simuler un appel à une API distante
    const fetchMessages = async () => {
      setLoading(true);
      await new Promise((resolve) => setTimeout(resolve, 1000)); // attente 1 seconde

      const mockData: MessageItem[] = [
        {
          id: '1',
          name: 'Jean Baptiste',
          lastMessage: 'Comment va-t-on sortir de là...',
          time: '10:24',
          avatar: 'https://i.pravatar.cc/100?img=1',
          unread: true,
        },
        {
          id: '2',
          name: 'Marie Claire',
          lastMessage: 'Evidemment !',
          time: '09:51',
          avatar: 'https://i.pravatar.cc/100?img=2',
        },
        {
          id: '3',
          name: 'Michel',
          lastMessage: 'Ca me va :)',
          time: 'Hier',
          avatar: 'https://i.pravatar.cc/100?img=3',
        },
      ];

      setMessages(mockData);
      setLoading(false);
    };

    fetchMessages();
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Messages</Text>
        <TouchableOpacity
          style={styles.roomiesButton}
          onPress={() => navigation.navigate('GroupMessage', { groupId: 1 })}>
          <Text style={styles.roomiesText}>Roomies</Text>
        </TouchableOpacity>
      </View>

      {/* Loader ou Liste */}
      {loading ? (
        <ActivityIndicator size="large" color="#007AFF" style={{ marginTop: 20 }} />
      ) : (
        <FlatList
          data={messages}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ paddingHorizontal: 16 }}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.messageContainer}
              onPress={() =>
                navigation.navigate('SharedStack', {
                  screen: 'DirectMessage',
                  params: { userId: Number(item.id) },
                })
              }>
              <Image source={{ uri: item.avatar }} style={styles.avatar} />
              <View style={styles.messageContent}>
                <View style={styles.messageHeader}>
                  <Text style={styles.name}>{item.name}</Text>
                  <Text style={styles.time}>{item.time}</Text>
                </View>
                <Text
                  numberOfLines={1}
                  style={[styles.lastMessage, item.unread && styles.unreadMessage]}>
                  {item.lastMessage}
                </Text>
              </View>
            </TouchableOpacity>
          )}
        />
      )}
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
  time: {
    fontSize: 12,
    color: '#888',
  },
  lastMessage: {
    fontSize: 14,
    color: '#666',
  },
  unreadMessage: {
    fontWeight: 'bold',
    color: '#000',
  },
});
