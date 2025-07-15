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

export default function GroupMessageListScreen({
  navigation,
}: MessageStackScreenProps<'GroupMessageList'>) {
  const [messages, setMessages] = useState<MessageItem[] | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simuler un appel à une API distante
    const fetchMessages = async () => {
      setLoading(true);
      // await new Promise((resolve) => setTimeout(resolve, 1000)); // attente 1 seconde

      const mockData: MessageItem[] = [
        {
          id: '1',
          name: 'Appartement Paris 12e',
          lastMessage: 'Visite prévue demain à 18h',
          time: '10:24',
          avatar:
            'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=100&q=80',
          unread: true,
        },
        {
          id: '2',
          name: 'Loft Nation - Duplex',
          lastMessage: 'Le contrat est prêt à être signé',
          time: '09:51',
          avatar:
            'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=100&q=80',
        },
        {
          id: '3',
          name: 'Studio Michel-Ange',
          lastMessage: 'Maintenant si vous êtes prêts',
          time: 'Hier',
          avatar:
            'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=100&q=80',
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
          onPress={() => navigation.navigate('DirectMessageList')}>
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
              onPress={() => navigation.navigate('GroupMessage')}>
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
