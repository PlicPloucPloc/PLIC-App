import React, { useEffect, useRef, useState } from 'react';
import {
  FlatList,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  View,
  Image,
  TextInput,
  Pressable,
} from 'react-native';

import { Ionicons } from '@expo/vector-icons';

import { ColorTheme } from '@app/Colors';
import { chatService, Message, MessageResponse } from '@app/definitions/rest/ChatService';
import { useThemeColors } from '@app/hooks/UseThemeColor';
import store from '@app/redux/Store';
import { getMessage } from '@app/rest/ChatService';
import Loader from '@components/Loader';
import { SharedStackScreenProps } from '@navigation/Types';

type FlatMessage = {
  id: number | string;
  room_id: number;
  message: string;
  sender_id: string;
  created_at: string;
  participants: string[];
  isSending?: boolean;
};

export default function DirectMessageScreen({
  navigation,
  route,
}: SharedStackScreenProps<'DirectMessage'>) {
  const colors = useThemeColors();
  const styles = createStyles(colors);
  const flatListRef = useRef<FlatList>(null);
  const currentUserId: string = store.getState().authState.userId;

  const [loading, setLoading] = useState(true);
  const [inputMessage, setInputMessage] = useState('');
  const [sending, setSending] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [messages, setMessages] = useState<FlatMessage[]>([]);
  const [roomId, setRoomId] = useState<number>(0);

  useEffect(() => {
    console.log('=== DirectMessageScreen mounted ===');
    console.log('Current user ID:', currentUserId);
    console.log('Room ID:', roomId);
    if (route.params.roomId == null) {
      console.log('no roomid');
      setLoading(false);
      return;
    }

    setRoomId(route.params.roomId);
    chatService.connect();
    const unsubscribeConnection = chatService.onConnectionChange((connected) => {
      console.log('Connection status changed:', connected);
      setIsConnected(connected);
    });

    const fetchMessages = async () => {
      try {
        const messageResponse: MessageResponse | null = await getMessage(roomId);
        console.log('Messages for room', roomId, ':', messageResponse);

        if (!messageResponse) {
          console.error('No messages found');
          return;
        }
        const allMessages: FlatMessage[] = messageResponse.messages.map((msg) => ({
          id: msg.id,
          room_id: msg.room_id,
          message: msg.message,
          sender_id: msg.sender_id,
          created_at: msg.created_at,
          participants: messageResponse.participants,
        }));

        console.log('Flattened messages:', allMessages);
        setMessages(allMessages);
      } catch (error) {
        console.error('Error fetching messages:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMessages();
    const unsubscribeMessages = chatService.onMessageForRoom(roomId, (newMessage: Message) => {
      console.log('New message received:', newMessage);

      const flatMessage: FlatMessage = {
        id: newMessage.id,
        room_id: newMessage.room_id,
        message: newMessage.message,
        sender_id: newMessage.sender_id,
        created_at: new Date().toISOString(),
        participants: [],
      };

      setMessages((prev) => [...prev, flatMessage]);
    });

    return () => {
      console.log('=== DirectMessageScreen unmounted ===');
      unsubscribeConnection();
      unsubscribeMessages();
    };
  }, [route.params.roomId, currentUserId, roomId]);

  const handleSend = async () => {
    if (!inputMessage.trim() || !roomId) return;

    const messageText = inputMessage.trim();
    const tempId = `temp-${Date.now()}`;
    const optimisticMessage: FlatMessage = {
      id: tempId,
      room_id: roomId,
      message: messageText,
      sender_id: currentUserId,
      created_at: new Date().toISOString(),
      participants: [],
      isSending: true,
    };

    setMessages((prev) => [...prev, optimisticMessage]);
    setInputMessage('');
    setSending(true);

    try {
      const success = await chatService.sendMessage(roomId, messageText);

      if (success) {
        console.log('Message sent successfully');
        setMessages((prev) =>
          prev.map((msg) => (msg.id === tempId ? { ...msg, isSending: false } : msg)),
        );
      } else {
        console.error('Failed to send message');
        setMessages((prev) => prev.filter((msg) => msg.id !== tempId));
        setInputMessage(messageText);
      }
    } catch (error) {
      console.error('Error sending message:', error);
      setMessages((prev) => prev.filter((msg) => msg.id !== tempId));
      setInputMessage(messageText);
    } finally {
      setSending(false);
    }
  };

  const renderMessage = ({ item }: { item: FlatMessage }) => {
    const isMyMessage = item.sender_id === currentUserId;

    return (
      <View
        style={[
          styles.messageContainer,
          isMyMessage ? styles.myMessageContainer : styles.theirMessageContainer,
        ]}>
        <View
          style={[
            styles.messageBubble,
            isMyMessage ? styles.myMessageBubble : styles.theirMessageBubble,
            item.isSending && styles.messageSending,
          ]}>
          <Text style={[styles.messageText, isMyMessage && styles.myMessageText]}>
            {item.message}
          </Text>
          <Text style={[styles.messageTime, isMyMessage && styles.myMessageTime]}>
            {new Date(item.created_at).toLocaleTimeString('fr-FR', {
              hour: '2-digit',
              minute: '2-digit',
            })}
            {item.isSending && ' ⏳'}
          </Text>
        </View>
      </View>
    );
  };

  if (loading) {
    return <Loader loading={true} />;
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}>
      {!isConnected && (
        <View style={styles.connectionBanner}>
          <Text style={styles.connectionText}>Connecting...</Text>
        </View>
      )}

      <View style={styles.senderInfo}>
        <Image source={{ uri: undefined }} style={styles.avatar} />
        <Text style={styles.senderName}>{'otherUserName'}</Text>
      </View>

      <FlatList
        ref={flatListRef}
        data={messages}
        renderItem={renderMessage}
        keyExtractor={(item) => `${item.room_id}-${item.id}`}
        contentContainerStyle={styles.messagesList}
        onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No messages yet. Say hi!</Text>
          </View>
        }
      />

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Type a message..."
          placeholderTextColor={colors.textSecondary}
          value={inputMessage}
          onChangeText={setInputMessage}
          multiline
          maxLength={500}
          onSubmitEditing={handleSend}
        />
        <Pressable
          style={[
            styles.sendButton,
            (!inputMessage.trim() || sending) && styles.sendButtonDisabled,
          ]}
          onPress={handleSend}
          disabled={!inputMessage.trim() || sending}>
          <Ionicons
            name="send"
            size={24}
            color={!inputMessage.trim() || sending ? colors.textSecondary : colors.primary}
          />
        </Pressable>
      </View>
    </KeyboardAvoidingView>
  );
}

const createStyles = (colors: ColorTheme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    connectionBanner: {
      backgroundColor: '#FFA500',
      paddingVertical: 8,
      alignItems: 'center',
    },
    connectionText: {
      color: '#fff',
      fontSize: 12,
      fontWeight: '600',
    },
    messagesList: {
      paddingHorizontal: 16,
      paddingVertical: 12,
      flexGrow: 1,
    },
    emptyContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      paddingVertical: 48,
    },
    emptyText: {
      fontSize: 16,
      color: colors.textSecondary,
      textAlign: 'center',
    },
    messageContainer: {
      marginVertical: 4,
      maxWidth: '80%',
    },
    myMessageContainer: {
      alignSelf: 'flex-end',
    },
    theirMessageContainer: {
      alignSelf: 'flex-start',
    },
    messageBubble: {
      paddingHorizontal: 12,
      paddingVertical: 8,
      borderRadius: 16,
    },
    myMessageBubble: {
      backgroundColor: colors.primary,
    },
    theirMessageBubble: {
      backgroundColor: '#E5E5EA',
    },
    messageSending: {
      opacity: 0.6,
    },
    messageText: {
      fontSize: 16,
      color: colors.textPrimary,
      marginBottom: 2,
    },
    myMessageText: {
      color: '#fff',
    },
    messageTime: {
      fontSize: 11,
      color: colors.textSecondary,
      alignSelf: 'flex-end',
    },
    myMessageTime: {
      color: 'rgba(255, 255, 255, 0.7)',
    },
    inputContainer: {
      flexDirection: 'row',
      alignItems: 'flex-end',
      paddingHorizontal: 12,
      paddingVertical: 8,
      backgroundColor: colors.background,
      borderTopWidth: 1,
      borderTopColor: '#E5E5EA',
    },
    input: {
      flex: 1,
      backgroundColor: '#F2F2F7',
      borderRadius: 20,
      paddingHorizontal: 16,
      paddingVertical: 8,
      fontSize: 16,
      color: colors.textPrimary,
      maxHeight: 100,
      marginRight: 8,
    },
    sendButton: {
      width: 40,
      height: 40,
      borderRadius: 20,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#F2F2F7',
    },
    sendButtonDisabled: {
      opacity: 0.5,
    },
    avatar: {
      width: 28,
      height: 28,
      borderRadius: 14,
      marginRight: 6,
    },
    senderName: {
      fontWeight: '600',
      color: '#333',
    },
    senderInfo: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 4,
      paddingHorizontal: 16,
      paddingVertical: 8,
    },
  });
