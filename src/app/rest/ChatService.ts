import * as SecureStore from 'expo-secure-store';

import {
  CreateRoomResponse,
  GetRoomResponse,
  MessageResponse,
  RoomRequest,
  UpdateRoomRequest,
} from '@app/definitions/rest/ChatService';
import store from '@app/redux/Store';
import { alertOnResponseError } from '@app/utils/Error';

import { apiFetch } from './Client';
import Endpoints from './Endpoints';

export async function getRooms(): Promise<GetRoomResponse[]> {
  const response = await apiFetch(
    Endpoints.CHAT.GET_ROOMS,
    {
      method: 'GET',
    },
    true,
  );

  if (await alertOnResponseError(response, 'Chat', 'getting rooms')) {
    return [];
  }
  const data: GetRoomResponse[] = await response.json();
  return data;
}

export async function postRoom(room: RoomRequest): Promise<number | null> {
  const participants = [...new Set([...room.users, room.owner_id])];
  const existingRoom = await isRoomExisting(participants);
  if (existingRoom) {
    return existingRoom;
  }
  const response = await apiFetch(
    Endpoints.CHAT.CREATE_ROOM,
    {
      method: 'POST',
      body: JSON.stringify(room),
    },
    true,
  );

  if (await alertOnResponseError(response, 'Chat', 'creating room')) {
    return null;
  }

  const data: CreateRoomResponse = await response.json();
  return data.data;
}

export async function deleteRoom(id: number): Promise<boolean> {
  const response = await apiFetch(
    Endpoints.CHAT.DELETE_ROOM(id),
    {
      method: 'DELETE',
    },
    true,
  );

  if (await alertOnResponseError(response, 'Chat', 'deleting room')) {
    return false;
  }

  return true;
}

export async function isRoomExisting(participants: string[]): Promise<number | null> {
  const response = await apiFetch(
    Endpoints.CHAT.GET_ROOMS,
    {
      method: 'GET',
    },
    true,
  );
  if (await alertOnResponseError(response, 'Chat', 'getting rooms')) {
    return null;
  }

  const rooms: GetRoomResponse[] = await response.json();
  const normalizedParticipants = [...new Set(participants)].sort();

  for (const room of rooms) {
    const normalizedRoomParticipants = [...new Set(room.participants_id)].sort();

    if (
      normalizedRoomParticipants.length === normalizedParticipants.length &&
      normalizedParticipants.every((p, i) => p === normalizedRoomParticipants[i])
    ) {
      return room.room_id;
    }
  }
  return null;
}

export async function getMyRoomswith2participants(): Promise<GetRoomResponse[]> {
  const currentUserId = store.getState().authState.userId;
  const data: GetRoomResponse[] = await getRooms();
  return data.filter(
    (room) =>
      room.participants_id.includes(currentUserId || '') && room.participants_id.length <= 2,
  );
}

export async function getMyRoomswithGroupParticipants(): Promise<GetRoomResponse[]> {
  const currentUserId = store.getState().authState.userId;
  const data: GetRoomResponse[] = await getRooms();
  return data.filter(
    (room) => room.participants_id.includes(currentUserId || '') && room.participants_id.length > 2,
  );
}

export async function getMyRooms(): Promise<GetRoomResponse[]> {
  const currentUserId = store.getState().authState.userId;
  const data: GetRoomResponse[] = await getRooms();
  return data.filter((room) => room.participants_id.includes(currentUserId || '') && room.is_owner);
}

export async function getMessage(id: number): Promise<MessageResponse | null> {
  const token = await SecureStore.getItemAsync('token');
  const response = await apiFetch(
    Endpoints.CHAT.GET_MESSAGE(id),
    {
      method: 'GET',
      headers: { token: token || '' },
    },
    true,
  );
  console.log('response', response);

  if (await alertOnResponseError(response, 'Chat', 'getting Messages')) {
    return null;
  }
  const data: MessageResponse = await response.json();
  return data;
}

export async function updateParticipant(
  updateRoomRequest: UpdateRoomRequest,
): Promise<MessageResponse[]> {
  const response = await apiFetch(
    Endpoints.CHAT.UPDATE_ROOMS,
    {
      method: 'PUT',
      body: JSON.stringify(updateRoomRequest),
    },
    true,
  );

  if (await alertOnResponseError(response, 'Chat', 'adding participants')) {
    return [];
  }

  const data: MessageResponse[] = await response.json();
  return data;
}
