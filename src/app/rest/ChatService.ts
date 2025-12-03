import { AuthState } from '@app/definitions';
import {
  CreateRoomResponse,
  Room,
  RoomDetails,
  CreateRoomRequest,
  UpdateRoomRequest,
} from '@app/definitions/rest/ChatService';
import { alertOnResponseError } from '@app/utils/Error';

import { apiFetch } from './Client';
import Endpoints from './Endpoints';
import { getOtherUserInfo } from './UserService';

// Add participant details to a room
async function addRoomParticipants<T extends Room | RoomDetails>(
  userId: string,
  room: T,
): Promise<T | null> {
  const otherUsers = room.participants_id.filter((id) => id !== userId);
  const participants = otherUsers.map((id) => getOtherUserInfo(id));

  const resolvedParticipants = await Promise.all(participants);
  if (resolvedParticipants.includes(null)) {
    return null;
  }

  resolvedParticipants.filter((participant) => participant !== null);

  room.participants = resolvedParticipants as AuthState[];

  return room;
}

// Add participant details to multiple rooms
async function addRoomsParticipants<T extends Room | RoomDetails>(
  userId: string,
  rooms: T[],
): Promise<T[]> {
  const promises = [];

  for (const room of rooms) {
    promises.push(addRoomParticipants(userId, room));
  }

  const roomsInfo = await Promise.all(promises);

  return roomsInfo.filter((room) => room !== null);
}

async function getRooms(): Promise<Room[]> {
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
  const data: Room[] = await response.json();
  return data;
}

export async function getDirectMessageRooms(userId: string): Promise<Room[]> {
  const allRooms = await getRooms();
  const directMessageRooms = allRooms.filter((room) => room.participants_id.length == 2);
  return addRoomsParticipants(userId, directMessageRooms);
}

export async function getGroupMessageRooms(userId: string): Promise<Room[]> {
  const allRooms = await getRooms();
  const groupMessageRooms = allRooms.filter((room) => room.participants_id.length > 2);
  return addRoomsParticipants(userId, groupMessageRooms);
}

export async function getMyRooms(userId: string): Promise<Room[]> {
  const allRooms = await getRooms();
  const myRooms = allRooms.filter((room) => room.is_owner);
  return addRoomsParticipants(userId, myRooms);
}

export async function getAllRooms(userId: string): Promise<Room[]> {
  const allRooms = await getRooms();
  return addRoomsParticipants(userId, allRooms);
}

export async function getRoomDetails(userId: string, roomId: number): Promise<RoomDetails | null> {
  const response = await apiFetch(
    Endpoints.CHAT.GET_ROOM_DETAILS(roomId),
    {
      method: 'GET',
    },
    true,
  );

  if (await alertOnResponseError(response, 'Chat', 'getting room by ID')) {
    return null;
  }

  const data: RoomDetails = await response.json();

  return addRoomParticipants(userId, data);
}

async function createRoom(room: CreateRoomRequest): Promise<number | null> {
  const existingRoomId = await doesRoomExists(room);
  if (existingRoomId) {
    return existingRoomId;
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

async function doesRoomExists(newRoom: CreateRoomRequest): Promise<number | null> {
  const rooms = await getRooms();
  if (!rooms) {
    return null;
  }

  const newRoomParticipantsSet = new Set(newRoom.users);

  for (const room of rooms) {
    if (newRoom.apartment_id !== room.apartment_id) {
      continue;
    }

    const roomParticipantsSet = new Set(room.participants_id);

    if (
      roomParticipantsSet.size === newRoomParticipantsSet.size &&
      newRoom.users.every((p) => roomParticipantsSet.has(p))
    ) {
      return room.room_id;
    }
  }
  return null;
}

export async function createAndGetRoom(
  userId: string,
  room: CreateRoomRequest,
): Promise<Room | null> {
  const roomId = await createRoom(room);
  if (!roomId) {
    return null;
  }

  const roomDetails = await getRoomDetails(userId, roomId);

  return roomDetails ? roomDetailToRoom(userId, roomDetails) : null;
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

export async function getMessage(id: number): Promise<RoomDetails | null> {
  const response = await apiFetch(
    Endpoints.CHAT.GET_MESSAGE(id),
    {
      method: 'GET',
    },
    true,
  );
  if (await alertOnResponseError(response, 'Chat', 'getting Messages')) {
    return null;
  }
  const data: RoomDetails = await response.json();
  return data;
}

export async function updateParticipant(
  updateRoomRequest: UpdateRoomRequest,
): Promise<RoomDetails[]> {
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

  const data: RoomDetails[] = await response.json();
  return data;
}

export function roomDetailToRoom(userId: string, roomDetail: RoomDetails): Room {
  return {
    room_id: roomDetail.room_id,
    apartment_id: roomDetail.apartment_id,
    participants_id: roomDetail.participants_id,
    last_message:
      roomDetail.messages.length > 0 ? roomDetail.messages[roomDetail.messages.length - 1] : null,
    is_owner: roomDetail.owner_id === userId,
    created_at: roomDetail.created_at,
    participants: roomDetail.participants,
  };
}
