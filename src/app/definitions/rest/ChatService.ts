import * as SecureStore from 'expo-secure-store';

// API Types
export type GetRoomResponse = {
  room_id: number;
  participants_id: string[];
  last_message: string | null;
  is_owner: boolean;
  created_at: string;
};

export type CreateRoomResponse = {
  error_message: string | null;
  data: number | null;
};

export type RoomRequest = {
  users: string[];
  apartment_id: number | null;
  owner_id: string;
};

export type UpdateRoomRequest = {
  room_id: number;
  users_to_add: string[];
  users_to_remove: string[];
};

export type MessageResponse = {
  apartment_id: number | null;
  created_at: string;
  messages: {
    id: number;
    room_id: number;
    message: string;
    sender_id: string;
    created_at: string;
  }[];
  owner_id: string;
  participants: string[];
  room_id: number;
};

// WebSocket Types
type CommandType = 'SendMessage';
type ResponseType = 'Disconnection' | 'MessageReceived' | 'MessageSentConfirmation';

export type Message = {
  id: number;
  room_id: number;
  sender_id: string;
  message: string;
  created_at: string;
  isSending?: boolean;
};

type MsgSendData = {
  room_id: number;
  message: string;
  message_temp_id: string;
};

type MessageReceivedData = {
  room_id: number;
  sender_id: string;
  message: string;
};

type MessageSentConfirmationData = {
  confirmed: boolean;
  reason: string;
  message_id: string;
};

type WebSocketCommand = {
  type: CommandType;
  data: MsgSendData;
};

type WebSocketResponse = {
  type: ResponseType;
  data: MessageReceivedData | MessageSentConfirmationData | { code: number; reason: string };
};

class ChatService {
  private ws: WebSocket | null = null;
  private reconnectTimeout: NodeJS.Timeout | null = null;
  private messageCallbacks: Map<string, (confirmed: boolean, reason?: string) => void> = new Map();
  private messageListeners: Map<number, ((message: Message) => void)[]> = new Map();
  private connectionListeners: ((connected: boolean) => void)[] = [];

  async connect() {
    try {
      const token = await SecureStore.getItemAsync('token');
      if (!token) {
        console.error('No token found for WebSocket connection');
        return;
      }

      const wsUrl = `ws://10.41.176.85:3030?token=${token}`;
      console.log('Connecting to WebSocket:', wsUrl);

      this.ws = new WebSocket(wsUrl);

      this.ws.onopen = () => {
        console.log('WebSocket connected successfully');
        this.notifyConnectionListeners(true);
        if (this.reconnectTimeout) {
          clearTimeout(this.reconnectTimeout);
          this.reconnectTimeout = null;
        }
      };

      this.ws.onmessage = (event) => {
        console.log('Raw WebSocket message:', event.data);
        try {
          const response: WebSocketResponse = JSON.parse(event.data);
          console.log('Parsed message type:', response.type);
          this.handleMessage(response);
        } catch (error) {
          console.error('Error parsing WebSocket message:', error);
        }
      };

      this.ws.onerror = (error) => {
        console.error('WebSocket error occurred');
        console.error('Error details:', JSON.stringify(error, null, 2));
        console.error('WebSocket state:', this.ws?.readyState);
        console.error('WebSocket URL:', this.ws?.url);
      };

      this.ws.onclose = (event) => {
        console.log('WebSocket closed');
        console.log('Close code:', event.code);
        console.log('Close reason:', event.reason);
        console.log('Was clean:', event.wasClean);
        console.log('WebSocket state:', this.ws?.readyState);
        this.notifyConnectionListeners(false);
        this.handleDisconnection(event.code);
      };
    } catch (error) {
      console.error('Error connecting to WebSocket:', error);
    }
  }

  private handleMessage(response: WebSocketResponse) {
    switch (response.type) {
      case 'MessageReceived':
        const msgData = response.data as MessageReceivedData;
        console.log('Message received - Room:', msgData.room_id, 'From:', msgData.sender_id);

        const newMessage: Message = {
          id: Date.now(), // Temporaire, sera remplacé par l'ID du serveur
          room_id: msgData.room_id,
          sender_id: msgData.sender_id,
          message: msgData.message,
          created_at: new Date().toISOString(),
        };

        this.notifyMessageListeners(msgData.room_id, newMessage);
        break;

      case 'MessageSentConfirmation':
        const confirmData = response.data as MessageSentConfirmationData;
        console.log('Message confirmation:', confirmData.confirmed);

        const callback = this.messageCallbacks.get(confirmData.message_id);
        if (callback) {
          callback(confirmData.confirmed, confirmData.reason);
          this.messageCallbacks.delete(confirmData.message_id);
        }
        break;

      case 'Disconnection':
        const discData = response.data as { code: number; reason: string };
        console.log('Disconnection event:', discData);
        this.handleDisconnection(discData.code);
        break;
    }
  }

  private handleDisconnection(code: number) {
    const codeMessages: { [key: number]: string } = {
      4001: 'No authentication token provided',
      4002: 'Token validation failed',
      4003: 'Disconnected due to inactivity',
      4004: 'Disconnected by admin',
      4005: 'User is banned',
      4006: 'Server error occurred',
      4007: 'Server is shutting down',
      4008: 'New device connection',
      4009: 'Connection closed',
      4010: 'Bad message structure',
      4011: 'Hateful speech detected',
    };

    console.log(`Disconnection: ${codeMessages[code] || 'Unknown'}`);

    if ([4006, 4007, 4009].includes(code) && !this.reconnectTimeout) {
      console.log('Reconnecting in 3 seconds...');
      this.reconnectTimeout = setTimeout(() => this.connect(), 3000);
    }
  }

  sendMessage(roomId: number, message: string): Promise<boolean> {
    return new Promise((resolve) => {
      if (!this.ws || this.ws.readyState !== WebSocket.OPEN) {
        console.error('WebSocket not connected');
        resolve(false);
        return;
      }

      const tempId = `temp-${Date.now()}-${Math.random()}`;
      console.log('Sending message to room:', roomId);

      const command: WebSocketCommand = {
        type: 'SendMessage',
        data: {
          room_id: roomId,
          message,
          message_temp_id: tempId,
        },
      };

      this.messageCallbacks.set(tempId, (confirmed) => {
        console.log(confirmed ? 'Message sent' : 'Message failed');
        resolve(confirmed);
      });

      this.ws.send(JSON.stringify(command));

      setTimeout(() => {
        if (this.messageCallbacks.has(tempId)) {
          console.warn('Message timeout');
          this.messageCallbacks.delete(tempId);
          resolve(false);
        }
      }, 10000);
    });
  }

  onMessageForRoom(roomId: number, callback: (message: Message) => void) {
    console.log('Listening to room:', roomId);

    if (!this.messageListeners.has(roomId)) {
      this.messageListeners.set(roomId, []);
    }

    this.messageListeners.get(roomId)!.push(callback);

    return () => {
      console.log('Stopped listening to room:', roomId);
      const listeners = this.messageListeners.get(roomId);
      if (listeners) {
        const filtered = listeners.filter((cb) => cb !== callback);
        if (filtered.length === 0) {
          this.messageListeners.delete(roomId);
        } else {
          this.messageListeners.set(roomId, filtered);
        }
      }
    };
  }

  onConnectionChange(callback: (connected: boolean) => void) {
    this.connectionListeners.push(callback);
    if (this.isConnected()) callback(true);

    return () => {
      this.connectionListeners = this.connectionListeners.filter((cb) => cb !== callback);
    };
  }

  private notifyMessageListeners(roomId: number, message: Message) {
    const listeners = this.messageListeners.get(roomId);
    if (listeners) {
      listeners.forEach((callback) => callback(message));
    }
  }

  private notifyConnectionListeners(connected: boolean) {
    this.connectionListeners.forEach((callback) => callback(connected));
  }

  disconnect() {
    console.log('🔌 Disconnecting...');
    if (this.reconnectTimeout) clearTimeout(this.reconnectTimeout);
    if (this.ws) this.ws.close();
    this.messageListeners.clear();
    this.messageCallbacks.clear();
  }

  isConnected(): boolean {
    return this.ws !== null && this.ws.readyState === WebSocket.OPEN;
  }
}

export const chatService = new ChatService();
