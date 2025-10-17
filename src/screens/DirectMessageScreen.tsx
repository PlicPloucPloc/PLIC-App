import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  FlatList,
  Image,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

import { getToken } from '@app/rest/Client';
import MessageHeader, { User } from '@components/MessageHeader';
import { AntDesign, Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface Message {
  id: number;
  text: string;
  imageUri?: string;
  isMe: boolean;
  timestamp: string;
  tempId?: string;
  confirmed?: boolean;
}

type EventCallback = (data: any) => void;

class SwappartChatClient {
  private ws: WebSocket | null = null;
  private isConnected: boolean = false;
  private messageCallbacks: Map<string, EventCallback> = new Map();
  private reconnectAttempts: number = 0;
  private maxReconnectAttempts: number = 3;

  async connect(): Promise<void> {
    return new Promise(async (resolve, reject) => {
      try {
        if (this.ws) {
          this.ws.close();
          this.ws = null;
        }
        this.isConnected = false;

        const token = await getToken();

        console.log(token);
        if (!token) {
          console.error('Aucun token trouvé');
          reject(new Error('No token available'));
          return;
        }

        console.log('Tentative de connexion WebSocket...');
        this.ws = new WebSocket(`ws://192.168.189.81:3030?token=${token}`);

        this.ws.onopen = () => {
          console.log('Connexion WebSocket établie');
          this.isConnected = true;
          this.reconnectAttempts = 0;
          resolve();
        };

        this.ws.onmessage = (event: MessageEvent) => {
          try {
            const response = JSON.parse(event.data);
            console.log('Message reçu:', response);
            const callback = this.messageCallbacks.get(response.type);
            if (callback) {
              callback(response.data);
            }
          } catch (error) {
            console.error('Erreur parsing message WebSocket:', error);
          }
        };

        this.ws.onclose = async (event: CloseEvent) => {
          console.log('Connexion fermée:', event.code, event.reason);
          this.isConnected = false;

          if (event.code === 4008) {
            console.log('📱 Connexion depuis un autre appareil');
            const callback = this.messageCallbacks.get('Disconnection');
            if (callback) {
              callback({ code: event.code, reason: event.reason });
            }
          }
        };

        this.ws.onerror = (error: Event) => {
          console.error('Erreur WebSocket:', error);
          reject(error);
        };
      } catch (error) {
        console.error('Erreur lors de la connexion:', error);
        reject(error);
      }
    });
  }

  on(eventType: string, callback: EventCallback): void {
    this.messageCallbacks.set(eventType, callback);
  }

  sendMessage(roomId: number, message: string): string {
    if (!this.isConnected || !this.ws || this.ws.readyState !== WebSocket.OPEN) {
      throw new Error('Non connecté au serveur');
    }

    console.log('🔍 État WebSocket avant envoi:', this.getReadyStateText());

    const messageTempId = this.generateUUID();

    const messageData = {
      type: 'SendMessage',
      data: {
        room_id: roomId,
        message: message,
        message_temp_id: messageTempId,
      },
    };

    this.ws.send(JSON.stringify(messageData));
    return messageTempId;
  }

  private generateUUID(): string {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
      const r = (Math.random() * 16) | 0;
      const v = c === 'x' ? r : (r & 0x3) | 0x8;
      return v.toString(16);
    });
  }

  private getReadyStateText(): string {
    if (!this.ws) return 'Non initialisé';

    switch (this.ws.readyState) {
      case WebSocket.CONNECTING:
        return 'CONNECTING (0)';
      case WebSocket.OPEN:
        return 'OPEN (1)';
      case WebSocket.CLOSING:
        return 'CLOSING (2)';
      case WebSocket.CLOSED:
        return 'CLOSED (3)';
      default:
        return `État inconnu (${this.ws.readyState})`;
    }
  }

  disconnect(): void {
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
    this.isConnected = false;
  }

  getConnectionStatus(): boolean {
    return this.isConnected && this.ws?.readyState === WebSocket.OPEN;
  }
}

const mockUsers: User[] = [
  {
    id: 1,
    name: 'Jean Baptiste',
    avatar: 'https://i.pravatar.cc/100?img=1',
    lastMessage: 'Comment va-t-on sortir de là...',
  },
  {
    id: 2,
    name: 'Marie Claire',
    avatar: 'https://i.pravatar.cc/100?img=2',
    lastMessage: 'Évidemment !',
  },
  {
    id: 3,
    name: 'Michel',
    avatar: 'https://i.pravatar.cc/100?img=3',
    lastMessage: 'Ca me va :)',
  },
];

export default function DirectMessageScreen() {
  const [chatClient] = useState(() => new SwappartChatClient());
  const roomId = 123;

  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState<string>('');
  const [isConnected, setIsConnected] = useState<boolean>(false);

  const flatListRef = useRef<FlatList<Message>>(null);
  const currentUser: User = mockUsers[1];

  const getStorageKey = (roomId: number) => `messages_room_${roomId}`;

  useEffect(() => {
    const loadMessages = async () => {
      try {
        const storedMessages = await AsyncStorage.getItem(getStorageKey(roomId));
        if (storedMessages) {
          const parsedMessages = JSON.parse(storedMessages);
          setMessages(parsedMessages);
        }
      } catch (error) {
        console.error('Erreur lors du chargement des messages:', error);
      }
    };

    loadMessages();
  }, [roomId]);

  const saveMessages = useCallback(
    async (messagesToSave: Message[]) => {
      try {
        await AsyncStorage.setItem(getStorageKey(roomId), JSON.stringify(messagesToSave));
      } catch (error) {
        console.error('Erreur lors de la sauvegarde des messages:', error);
      }
    },
    [roomId],
  );

  const addMessage = useCallback(
    (message: Message) => {
      setMessages((prevMessages) => {
        const newMessages = [...prevMessages, message];
        saveMessages(newMessages);
        return newMessages;
      });
    },
    [saveMessages],
  );

  const updateMessage = useCallback(
    (tempId: string, updates: Partial<Message>) => {
      setMessages((prevMessages) => {
        const newMessages = prevMessages.map((msg) =>
          msg.tempId === tempId ? { ...msg, ...updates } : msg,
        );
        saveMessages(newMessages);
        return newMessages;
      });
    },
    [saveMessages],
  );

  useEffect(() => {
    const connectToChat = async () => {
      try {
        chatClient.on('MessageReceived', (data) => {
          console.log('Nouveau message reçu:', data);
          const newMessage: Message = {
            id: Date.now(),
            text: data.message,
            isMe: false,
            timestamp: new Date().toLocaleTimeString('fr-FR', {
              hour: '2-digit',
              minute: '2-digit',
            }),
            confirmed: true,
          };
          addMessage(newMessage);
        });

        chatClient.on('MessageSentConfirmation', (data) => {
          console.log('Confirmation message:', data);
          if (data.confirmed) {
            updateMessage(data.message_id, { confirmed: true });
          } else {
            console.error('Échec envoi message:', data.reason);
            updateMessage(data.message_id, { confirmed: false });
          }
        });

        chatClient.on('Disconnection', (data) => {
          console.log('Déconnecté du chat:', data);
          setIsConnected(false);
        });

        chatClient.on('ConnectionFailed', (data) => {
          console.log('Échec de connexion:', data);
          setIsConnected(false);
        });

        await chatClient.connect();
        setIsConnected(true);
        console.log('Connecté au chat');
      } catch (error) {
        console.error('Erreur de connexion:', error);
        setIsConnected(false);
      }
    };

    connectToChat();
    return () => {
      chatClient.disconnect();
    };
  }, [chatClient, addMessage, updateMessage]);
  const handleSend = (): void => {
    if (!inputText.trim()) return;

    if (!chatClient.getConnectionStatus()) {
      console.error('Non connecté au serveur');
      return;
    }

    try {
      const tempId = chatClient.sendMessage(roomId, inputText.trim());
      const newMessage: Message = {
        id: Date.now(),
        text: inputText,
        isMe: true,
        timestamp: new Date().toLocaleTimeString('fr-FR', {
          hour: '2-digit',
          minute: '2-digit',
        }),
        tempId: tempId,
        confirmed: false,
      };
      addMessage(newMessage);
      setInputText('');
    } catch (error) {
      console.error("Erreur lors de l'envoi:", error);
    }
  };

  const renderMessage = ({ item }: { item: Message }) => {
    const isImage = item.imageUri || item.text.startsWith('file://');

    return (
      <View style={[styles.messageContainer, item.isMe ? styles.myMessage : styles.otherMessage]}>
        {isImage ? (
          <Image source={{ uri: item.imageUri || item.text }} style={styles.messageImage} />
        ) : (
          <View style={[styles.messageBubble, item.isMe ? styles.myBubble : styles.otherBubble]}>
            <Text
              style={[
                styles.messageText,
                item.isMe ? styles.myMessageText : styles.otherMessageText,
              ]}>
              {item.text}
            </Text>
          </View>
        )}
        <Text style={styles.timestamp}>{item.timestamp}</Text>
      </View>
    );
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <MessageHeader user={currentUser} onBackPress={(): void => console.log('Back pressed')} />

      {!isConnected && (
        <View style={styles.connectionBanner}>
          <Text style={styles.connectionBannerText}>Connexion au serveur...</Text>
        </View>
      )}

      <FlatList
        ref={flatListRef}
        data={messages}
        renderItem={renderMessage}
        keyExtractor={(item) => item.id.toString()}
        style={styles.messagesList}
        contentContainerStyle={styles.messagesContainer}
        onContentSizeChange={() => {
          flatListRef.current?.scrollToEnd({ animated: true });
        }}
      />

      <View style={styles.inputContainer}>
        <TouchableOpacity onPress={() => {}} style={styles.attachButton}>
          <AntDesign name="picture" size={28} color="black" />
        </TouchableOpacity>

        <TextInput
          style={styles.textInput}
          value={inputText}
          onChangeText={setInputText}
          placeholder="Entrer text to chat..."
          multiline
          editable={isConnected}
        />

        <TouchableOpacity
          onPress={handleSend}
          style={[styles.sendButton, !isConnected && styles.sendButtonDisabled]}
          disabled={!isConnected}>
          <Ionicons name="send" size={24} color={isConnected ? 'black' : '#ccc'} />
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  connectionBanner: {
    backgroundColor: '#FFA500',
    padding: 8,
    alignItems: 'center',
  },
  connectionBannerText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  messagesList: {
    flex: 1,
  },
  messagesContainer: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  messageContainer: {
    marginVertical: 4,
  },
  myMessage: {
    alignItems: 'flex-end',
  },
  otherMessage: {
    alignItems: 'flex-start',
  },
  messageBubble: {
    maxWidth: '80%',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 18,
  },
  myBubble: {
    backgroundColor: '#007AFF',
    borderBottomRightRadius: 4,
  },
  otherBubble: {
    backgroundColor: '#E5E5EA',
    borderBottomLeftRadius: 4,
  },
  messageText: {
    fontSize: 16,
    lineHeight: 20,
  },
  myMessageText: {
    color: '#FFFFFF',
  },
  otherMessageText: {
    color: '#000000',
  },
  messageStatus: {
    fontSize: 10,
    color: '#FFFFFF',
    marginTop: 2,
    alignSelf: 'flex-end',
  },
  messageImage: {
    width: 200,
    height: 200,
    borderRadius: 10,
  },
  timestamp: {
    fontSize: 11,
    color: '#999',
    marginTop: 2,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
  },
  attachButton: {
    padding: 8,
    marginRight: 8,
  },
  textInput: {
    flex: 1,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    paddingHorizontal: 16,
    paddingVertical: 10,
    maxHeight: 100,
    fontSize: 16,
    backgroundColor: '#F8F8F8',
  },
  sendButton: {
    padding: 8,
    marginLeft: 8,
  },
  sendButtonDisabled: {
    opacity: 0.5,
  },
});
