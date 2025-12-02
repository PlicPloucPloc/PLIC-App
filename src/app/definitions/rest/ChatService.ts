import { AuthState } from '../redux/AuthState';

export type Room = {
  room_id: number;
  apartment_id: number | null;
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
  room_id: number;
  participants_id: string[];
  apartment_id: number | null;
  messages: Message[];
  owner_id: string;
  created_at: string;

  // Additionnal fields for app only
  participants: AuthState[];
};

export type CreateRoomRequest = {
  users: string[];
  apartment_id: number | null;
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
