import {
  CreateRoomResponse,
  GetRoomResponse,
  RoomRequest,
  UpdateRoomRequest,
} from '@app/definitions/rest/ChatService';
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

export async function postRoom(room: RoomRequest): Promise<string | null> {
  const participants = room.users;
  participants.push(room.owner_id);
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

export async function updateRoom(room: UpdateRoomRequest): Promise<boolean> {
  const response = await apiFetch(
    Endpoints.CHAT.UPDATE_ROOMS,
    {
      method: 'PUT',
      body: JSON.stringify(room),
    },
    true,
  );

  if (await alertOnResponseError(response, 'Chat', 'updating room')) {
    return false;
  }

  return true;
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

export async function isRoomExisting(participants: string[]): Promise<string | null> {
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
  for (let i = 0; i < rooms.length; i++) {
    const roomParticipants = rooms[i].data.participants;
    if (roomParticipants.length != participants.length) {
      continue;
    }
    roomParticipants.sort();
    participants.sort();
    if (participants.join(',') == roomParticipants.join(',')) {
      return rooms[i].data.room_id;
    }
  }
  return null;
}
