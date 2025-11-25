import { AuthState } from '../redux/AuthState';

export type Room = {
  room_id: number;
  participants_id: string[];
  last_message: Message | null;
  is_owner: boolean;
  created_at: string;

  // Additionnal fields for app only
  participants: AuthState[];
};

export type Message = {
  id: number;
  room_id: number;
  message: string;
  sender_id: string;
  created_at: string;

  // Additionnal fields for app only
  isSending: boolean;
};

export type RoomDetails = {
  apartment_id: number | null;
  created_at: string;
  messages: Message[];
  owner_id: string;
  participants_id: string[];
  room_id: number;

  // Additionnal fields for app only
  participants: AuthState[];
};

export type CreateRoomRequest = {
  users: string[];
  apartment_id: number | null;
  owner_id: string;
};

export type CreateRoomResponse = {
  error_message: string | null;
  data: number | null;
};

export type UpdateRoomRequest = {
  room_id: number;
  users_to_add: string[];
  users_to_remove: string[];
};
