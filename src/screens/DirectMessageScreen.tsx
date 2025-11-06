import { KeyboardAvoidingView, Platform, StyleSheet, Text, View } from 'react-native';

import { ColorTheme } from '@app/Colors';
import { useThemeColors } from '@app/hooks/UseThemeColor';

export default function DirectMessageScreen() {
  const colors = useThemeColors();
  const styles = createStyles(colors);

  // const [loading, setLoading] = useState(true);
  // const [messages, _setMessages] = useState<Message[]>([]);
  // const [inputMessage, setInputMessage] = useState('');
  // const [sending, setSending] = useState(false);
  // const [isConnected, _setIsConnected] = useState(false);
  // const [otherUserName, _setOtherUserName] = useState('');
  // const [_, _setOtherUserId] = useState<string | null>(null);
  // const [userInfo, _setUserInfo] = useState<AuthState>({
  //   firstName: '...',
  //   lastName: '...',
  //   profilePictureUri: null,
  // } as AuthState);
  // const initializeChat = async () => {
  //   try {
  //     setLoading(true);

  //     console.log('Fetching apartment owner...');
  //     const ownerId = await getApartmentOwnerId(apartmentId);

  //     if (!ownerId) {
  //       console.error('Failed to get apartment owner');
  //       setLoading(false);
  //       return;
  //     }

  //     console.log('Found owner ID:', ownerId);

  //     setOtherUserId(ownerId);
  //     const userInfo = await getOtherUserInfo(ownerId);

  //     if (!userInfo) {
  //       return;
  //     }

  //     setUserInfo(userInfo);

  //     console.log('Fetching participant info...');
  //     const participantInfo = await getParticipantInfo(ownerId);
  //     if (participantInfo) {
  //       const name = `${participantInfo.firstName} ${participantInfo.lastName}`;
  //       setOtherUserName(name);
  //       navigation.setOptions({ title: name });
  //       console.log('Participant name:', name);
  //     }

  //     console.log('Getting or creating room...');
  //     const fetchedRoomId = await getOrCreateRoomWithOwner(apartmentId, ownerId);

  //     if (!fetchedRoomId) {
  //       console.error('Failed to get room ID');
  //       setLoading(false);
  //       return;
  //     }

  //     console.log('Room ID:', fetchedRoomId);
  //     setRoomId(fetchedRoomId);

  //     console.log('Connecting to WebSocket...');
  //     await chatService.connect();

  //     const unsubscribeConnection = chatService.onConnectionChange((connected) => {
  //       console.log('Connection status changed:', connected);
  //       setIsConnected(connected);
  //     });

  //     console.log('Loading message history...');
  //     const historyMessages = await getRoomMessages(fetchedRoomId);
  //     console.log('Loaded', historyMessages.length, 'messages');

  //     const formattedMessages: Message[] = historyMessages.map((msg) => ({
  //       id: msg.id.toString(),
  //       room_id: msg.room_id,
  //       sender_id: msg.sender_id,
  //       message: msg.message,
  //       timestamp: new Date(msg.created_at),
  //     }));

  //     setMessages(formattedMessages);

  //     console.log('Subscribing to WebSocket messages...');
  //     const unsubscribeWS = chatService.onMessageForRoom(fetchedRoomId, (newMessage) => {
  //       console.log('New message from WebSocket:', newMessage);
  //       setMessages((prev) => {
  //         if (prev.some((m) => m.id === newMessage.id)) {
  //           return prev;
  //         }
  //         return [...prev, newMessage];
  //       });
  //     });

  //     console.log('Subscribing to Supabase realtime...');
  //     const unsubscribeSupabase = subscribeToRoomMessages(fetchedRoomId, (newMessage) => {
  //       console.log('New message from Supabase:', newMessage);
  //       const formattedMsg: Message = {
  //         id: newMessage.id.toString(),
  //         room_id: newMessage.room_id,
  //         sender_id: newMessage.sender_id,
  //         message: newMessage.message,
  //         timestamp: new Date(newMessage.created_at),
  //       };

  //       setMessages((prev) => {
  //         if (prev.some((m) => m.id === formattedMsg.id)) {
  //           return prev;
  //         }
  //         return [...prev, formattedMsg];
  //       });
  //     });

  //     setLoading(false);

  //     return () => {
  //       unsubscribeConnection();
  //       unsubscribeWS();
  //       unsubscribeSupabase();
  //     };
  //   } catch (error) {
  //     console.error('Error initializing chat:', error);
  //     setLoading(false);
  //   }
  // };
  // useEffect(() => {
  //   console.log('=== DirectMessageScreen mounted ===');
  //   console.log('Current user ID:', currentUserId);

  //   //initializeChat();

  //   return () => {
  //     console.log('=== DirectMessageScreen unmounted ===');
  //   };
  // }, [currentUserId, navigation]);

  // const handleSend = async () => {
  //   if (!inputMessage.trim() || !roomId || sending) {
  //     console.log('Cannot send: empty message or no room');
  //     return;
  //   }

  //   const messageToSend = inputMessage.trim();
  //   setInputMessage('');
  //   setSending(true);

  //   console.log('Sending message:', messageToSend);

  //   try {
  //     const success = await chatService.sendMessage(roomId, messageToSend);

  //     if (success) {
  //       console.log('Message sent successfully');
  //     } else {
  //       console.error('Failed to send message');
  //       alert('Failed to send message');
  //       setInputMessage(messageToSend);
  //     }
  //   } catch (error) {
  //     console.error('Error sending message:', error);
  //     alert('Error sending message');
  //     setInputMessage(messageToSend);
  //   } finally {
  //     setSending(false);
  //   }
  // };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}>
      {
        <View style={styles.connectionBanner}>
          <Text style={styles.connectionText}>Connecting...</Text>
        </View>
      }
      {/* 
      <View style={styles.senderInfo}>
        <Image source={{ uri: userInfo.profilePictureUri || undefined }} style={styles.avatar} />
        <Text style={styles.senderName}>{otherUserName}</Text>
      </View>

      <FlatList
        ref={flatListRef}
        data={messages}
        renderItem={renderMessage}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.messagesList}
        onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: false })}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No messages yet. Say hi!</Text>
          </View>
        }
      /> */}

      {/* <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Type a message..."
          placeholderTextColor={colors.textSecondary}
          value={inputMessage}
          onChangeText={setInputMessage}
          multiline
          maxLength={500}
        />
        <Pressable
          style={[
            styles.sendButton,
            (!inputMessage.trim() || sending) && styles.sendButtonDisabled,
          ]}
          onPress={handleSend}
          disabled={!inputMessage.trim() || sending}></Pressable>
      </View> */}
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
    },
  });
