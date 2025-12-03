import { API_TIMEOUT } from '@app/config/Constants';
import { API_WEBSOCKET_URL } from '@app/config/Env';
import { Message } from '@app/definitions/rest/ChatService';
import { getToken } from '@app/rest/Client';

const RECONNECT_DELAY = 3000;

// Do not put these types in src/app/definitions has their are internal to the ChatService

// Websocket requests
enum CommandType {
  SEND_MESSAGE = 'SendMessage',
}

type WSSendMessageData = {
  room_id: number;
  message: string;
  message_temp_id: string;
};

type WSSendMessageCommand = {
  type: CommandType;
  data: WSSendMessageData;
};

// Websocket responses
enum ResponseType {
  DISCONNECTION = 'Disconnection',
  MESSAGE_RECEIVED = 'MessageReceived',
  MESSAGE_SENT_CONFIRMATION = 'MessageSentConfirmation',
}

const responseCodes: { [key: number]: string } = {
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
type WSMessageReceivedData = {
  room_id: number;
  sender_id: string;
  message: string;
};

type WSMessageSentConfirmationData = {
  confirmed: boolean;
  reason: string;
  message_id: string;
};

type WSDisconnectionData = {
  code: number;
  reason: string;
};

type WebSocketResponse = {
  type: ResponseType;
  data: WSMessageReceivedData | WSMessageSentConfirmationData | WSDisconnectionData;
};

class ChatService {
  private ws: WebSocket | null = null;
  private reconnectTimeout: NodeJS.Timeout | null = null;

  // Tracks the status of all the messgaes that are being sent
  private messageCallbacks: Map<string, (confirmed: boolean, reason?: string) => void> = new Map();

  // Array of callbaks triggered when a message is received for a specific room
  private messageListeners: Map<number, ((message: Message) => void)[]> = new Map();

  // Array of callbacks triggered when a connection status changes
  private connectionListeners: ((connected: boolean) => void)[] = [];

  async connect() {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      return;
    }

    const token = await getToken();
    if (!token) {
      return console.error('No token available for WebSocket connection');
    }

    const wsUrl = `${API_WEBSOCKET_URL}?token=${token}`;
    console.log('Connecting to WebSocket at', wsUrl);

    this.ws = new WebSocket(wsUrl);

    this.ws.onopen = () => {
      this.notifyConnectionListeners(true);

      if (this.reconnectTimeout) {
        clearTimeout(this.reconnectTimeout);
        this.reconnectTimeout = null;
      }
    };

    this.ws.onmessage = (event) => {
      try {
        const response: WebSocketResponse = JSON.parse(event.data);
        this.handleMessage(response);
      } catch (error) {
        console.error('Error parsing WebSocket message:', error);
      }
    };

    this.ws.onerror = (error) => {
      console.error('Socket error:', JSON.stringify(error, null, 2));
    };

    this.ws.onclose = (event) => {
      this.handleDisconnection(event.code);
    };
  }

  isConnected(): boolean {
    return this.ws !== null && this.ws.readyState === WebSocket.OPEN;
  }

  disconnect() {
    if (this.reconnectTimeout) {
      clearTimeout(this.reconnectTimeout);
    }

    if (this.ws) {
      this.ws.close();
    }

    this.messageListeners.clear();
    this.messageCallbacks.clear();
  }

  private handleMessage(response: WebSocketResponse) {
    switch (response.type) {
      case ResponseType.MESSAGE_RECEIVED:
        const msgData = response.data as WSMessageReceivedData;

        const now = new Date();
        const newMessage: Message = {
          id: now.getTime(),
          room_id: msgData.room_id,
          message: msgData.message,
          sender_id: msgData.sender_id,
          created_at: now.toISOString(),
          isSending: false,
        };

        this.notifyMessageListeners(msgData.room_id, newMessage);
        break;

      case ResponseType.MESSAGE_SENT_CONFIRMATION:
        const confirmData = response.data as WSMessageSentConfirmationData;

        const callback = this.messageCallbacks.get(confirmData.message_id);
        if (callback) {
          callback(confirmData.confirmed, confirmData.reason);
          this.messageCallbacks.delete(confirmData.message_id);
        }
        break;

      case ResponseType.DISCONNECTION:
        const discData = response.data as WSDisconnectionData;
        this.handleDisconnection(discData.code);
        break;
    }
  }

  private handleDisconnection(code: number) {
    console.log(`Disconnection: ${responseCodes[code] || 'Unknown'}`);

    this.notifyConnectionListeners(false);

    if ([4006, 4007, 4009].includes(code) && !this.reconnectTimeout) {
      this.reconnectTimeout = setTimeout(this.connect, RECONNECT_DELAY);
    }
  }

  // This function returns a promise that will resolve when the socket receives the message confirmation
  sendMessage(roomId: number, message: string): Promise<boolean> {
    const tempId = `temp-${Date.now()}-${Math.random()}`;

    const command: WSSendMessageCommand = {
      type: CommandType.SEND_MESSAGE,
      data: {
        room_id: roomId,
        message,
        message_temp_id: tempId,
      },
    };

    return new Promise((resolve) => {
      if (!this.ws || this.ws.readyState !== WebSocket.OPEN) {
        console.error('WebSocket not connected');
        resolve(false);
        return;
      }

      // The promise will be resolved in handleMessage when confirmation is received
      this.messageCallbacks.set(tempId, resolve);

      this.ws.send(JSON.stringify(command));

      setTimeout(() => {
        if (this.messageCallbacks.has(tempId)) {
          console.warn('Message timeout');
          this.messageCallbacks.delete(tempId);
          resolve(false);
        }
      }, API_TIMEOUT);
    });
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

  // === Functions for the page to register callback for certain events ===
  onMessageForRoom(roomId: number, callback: (message: Message) => void) {
    if (!this.messageListeners.has(roomId)) {
      this.messageListeners.set(roomId, []);
    }

    this.messageListeners.get(roomId)!.push(callback);

    return () => {
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

    return () => {
      this.connectionListeners = this.connectionListeners.filter((cb) => cb !== callback);
    };
  }
}

export const chatService = new ChatService();
