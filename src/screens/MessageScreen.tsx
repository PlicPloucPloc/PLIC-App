import React, { useCallback, useEffect, useRef, useState } from 'react';
import { FlatList, StyleSheet, Text, View, TextInput, Pressable } from 'react-native';

import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import {
  AndroidSoftInputModes,
  KeyboardAvoidingView,
  KeyboardController,
} from 'react-native-keyboard-controller';
import { useSelector } from 'react-redux';

import { ColorTheme } from '@app/Colors';
import { Message, Room } from '@app/definitions/rest/ChatService';
import { useThemeColors } from '@app/hooks/UseThemeColor';
import { setShouldRefecthMessages, setShouldRefetchRoomInfo } from '@app/redux/slices';
import store, { RootState } from '@app/redux/Store';
import { getRoomDetails } from '@app/rest/ChatService';
import { chatService } from '@app/socket/ChatService';
import HeaderMessageInfo from '@components/HeaderMessageInfo';
import Loader from '@components/Loader';
import { SharedStackScreenProps } from '@navigation/Types';

export default function MessageScreen({ navigation, route }: SharedStackScreenProps<'Message'>) {
  const colors = useThemeColors();
  const styles = createStyles(colors);

  const authState = useSelector((state: RootState) => state.authState);
  const currentUserId = authState.userId;

  const flatListRef = useRef<FlatList>(null);
  const [loading, setLoading] = useState(true);
  const [inputMessage, setInputMessage] = useState('');
  const [sending, setSending] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);

  // Header
  const updateNavigationOptions = useCallback(
    (roomInfo: Room) => {
      navigation.setOptions({
        headerRight: () => <HeaderMessageInfo roomInfo={roomInfo} navigation={navigation} />,
      });
    },
    [navigation],
  );

  useEffect(() => {
    updateNavigationOptions(route.params.roomInfo);
  }, [route.params.roomInfo, updateNavigationOptions]);

  const roomInfoToUpdate = useSelector((state: RootState) => state.appState.shouldRefetchRoomInfo);

  useFocusEffect(
    useCallback(() => {
      if (roomInfoToUpdate?.room_id === route.params.roomInfo.room_id) {
        updateNavigationOptions(roomInfoToUpdate);
        store.dispatch(setShouldRefetchRoomInfo(null));
      }
    }, [route.params.roomInfo, roomInfoToUpdate, updateNavigationOptions]),
  );

  useEffect(() => {
    KeyboardController.setInputMode(AndroidSoftInputModes.SOFT_INPUT_ADJUST_RESIZE);
    return () => {
      KeyboardController.setInputMode(AndroidSoftInputModes.SOFT_INPUT_ADJUST_PAN);
    };
  }, []);

  // Effect to fetch room details and messages
  useEffect(() => {
    const fetchRoomDetails = async () => {
      setLoading(true);
      const roomDetails = await getRoomDetails(
        currentUserId,
        route.params.roomInfo.room_id,
      ).finally(() => setLoading(false));

      if (!roomDetails || roomDetails.participants.length === 0) {
        console.error('No room details found');
        return;
      }

      setMessages(roomDetails.messages.reverse());
    };

    fetchRoomDetails();
  }, [currentUserId, route.params.roomInfo.room_id]);

  // Effect to handle WebSocket connection and incoming messages
  useEffect(() => {
    if (!chatService.isConnected()) {
      chatService.connect();
    } else {
      setIsConnected(true);
    }

    const unsubscribeConnection = chatService.onConnectionChange(setIsConnected);

    const unsubscribeMessages = chatService.onMessageForRoom(
      route.params.roomInfo.room_id,
      (newMessage: Message) => {
        setMessages((prev) => [newMessage, ...prev]);
        store.dispatch(setShouldRefecthMessages(true));
      },
    );

    return () => {
      unsubscribeConnection();
      unsubscribeMessages();
    };
  }, [currentUserId, route.params.roomInfo]);

  const handleSend = async () => {
    const roomId = route.params.roomInfo.room_id;
    if (!inputMessage.trim()) {
      return;
    }

    const messageText = inputMessage.trim();

    const now = new Date();
    const newMessage: Message = {
      id: now.getTime(),
      room_id: roomId,
      message: messageText,
      sender_id: currentUserId,
      created_at: now.toISOString(),
      isSending: true,
    };

    setMessages((prev) => [newMessage, ...prev]);
    setInputMessage('');

    try {
      setSending(true);
      const success = await chatService.sendMessage(roomId, messageText);

      if (success) {
        setMessages((prev) =>
          prev.map((msg) => (msg.id === now.getTime() ? { ...msg, isSending: false } : msg)),
        );
        store.dispatch(setShouldRefecthMessages(true));
      } else {
        throw new Error('Failed to send message');
      }
    } catch (error) {
      console.error('Error sending message:', error);
      setMessages((prev) => prev.filter((msg) => msg.id !== now.getTime()));
      // setInputMessage(messageText);
    } finally {
      setSending(false);
    }
  };

  const renderMessage = ({ item }: { item: Message }) => {
    const isMyMessage = item.sender_id === currentUserId;

    const user = route.params.roomInfo.participants.find((p) => p.userId === item.sender_id);
    const sender = isMyMessage
      ? null
      : user
        ? `${user.firstName} ${user.lastName}`
        : 'Unknown User';
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
          {sender && <Text style={styles.messageSenderText}>{sender}</Text>}
          <Text style={styles.messageText}>{item.message}</Text>
          <Text style={styles.messageTime}>
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
    return <Loader loading={loading} />;
  }

  return (
    <View style={styles.container}>
      {!isConnected && (
        <View style={styles.connectionBanner}>
          <Text style={styles.connectionText}>Connecting...</Text>
        </View>
      )}

      <KeyboardAvoidingView style={{ flex: 1 }} behavior={undefined}>
        <FlatList
          ref={flatListRef}
          data={messages}
          inverted={true}
          renderItem={renderMessage}
          keyExtractor={(item) => `${item.room_id}-${item.id}`}
          contentContainerStyle={styles.messagesList}
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
    </View>
  );
}

const createStyles = (colors: ColorTheme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    connectionBanner: {
      backgroundColor: colors.contrast,
      paddingVertical: 8,
      alignItems: 'center',
    },
    connectionText: {
      color: colors.background,
      fontSize: 12,
      fontWeight: '600',
    },
    messagesList: {
      paddingHorizontal: 16,
      paddingVertical: 12,
      flexGrow: 1,
      justifyContent: 'flex-end',
    },

    emptyContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
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
      backgroundColor: colors.backgroundSecondary,
    },
    messageSending: {
      opacity: 0.6,
    },
    messageSenderText: {
      fontStyle: 'italic',
      fontSize: 14,
      color: colors.textSecondary,
      marginBottom: 4,
    },
    messageText: {
      fontSize: 16,
      color: colors.textPrimary,
      marginBottom: 2,
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
  });
