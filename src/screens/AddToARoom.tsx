import React, { useCallback, useEffect, useState } from 'react';
import { Alert, FlatList, StyleSheet, View } from 'react-native';

import { useSelector } from 'react-redux';

import { Room, UpdateRoomRequest } from '@app/definitions/rest/ChatService';
import { RootState } from '@app/redux/Store';
import { updateParticipant, getMyRooms } from '@app/rest/ChatService';
import MessageParticipantsList from '@components/MessageParticipantsList';
import { SharedStackScreenProps } from '@navigation/Types';

export default function AddToARoomScreen({
  navigation,
  route,
}: SharedStackScreenProps<'AddToARoom'>) {
  const currentUserId = useSelector((state: RootState) => state.authState.userId);
  const [rooms, setRooms] = useState<Room[]>([]);

  useEffect(() => {
    const fetchMessages = async () => {
      let rooms = await getMyRooms(currentUserId);

      if (!rooms) {
        Alert.alert('Something wrong happened.', 'An error occurred please retry later.');
        return;
      }

      rooms = rooms.filter((room) => !room.participants_id.includes(route.params.userId));

      setRooms(rooms);
    };

    fetchMessages();
  }, [currentUserId, route.params.userId]);

  const renderItem = useCallback(
    ({ item }: { item: Room }) => (
      <MessageParticipantsList
        roomInfo={item}
        onPress={() => {
          const updateRoomRequest: UpdateRoomRequest = {
            room_id: item.room_id,
            users_to_add: [route.params.userId],
            users_to_remove: [],
          };

          updateParticipant(updateRoomRequest);
          navigation.navigate('SharedStack', {
            screen: 'OtherProfile',
            params: { userId: route.params.userId },
          });
        }}
      />
    ),
    [navigation, route.params.userId],
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={rooms}
        contentContainerStyle={{ paddingHorizontal: 16 }}
        renderItem={renderItem}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
  },
  roomiesButton: {
    backgroundColor: '#D0E8FF',
    paddingVertical: 6,
    paddingHorizontal: 16,
    borderRadius: 20,
  },
  roomiesText: {
    color: '#007AFF',
    fontWeight: '600',
  },
  messageContainer: {
    flexDirection: 'row',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderColor: '#eee',
  },
  messageContent: {
    flex: 1,
    justifyContent: 'center',
    marginLeft: 12,
  },
  messageHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
  },
  lastMessage: {
    fontSize: 14,
    color: '#666',
  },
});
