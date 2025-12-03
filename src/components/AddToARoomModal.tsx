import React, { useCallback, useEffect, useState } from 'react';
import { Alert, FlatList, StyleSheet, Text, View } from 'react-native';

import { useSelector } from 'react-redux';

import { ColorTheme } from '@app/Colors';
import { AuthState } from '@app/definitions';
import { Room, UpdateRoomRequest } from '@app/definitions/rest/ChatService';
import { useThemeColors } from '@app/hooks/UseThemeColor';
import { setShouldRefecthMessages } from '@app/redux/slices';
import store, { RootState } from '@app/redux/Store';
import { updateParticipant, getMyRooms } from '@app/rest/ChatService';
import MessageParticipantsList from '@components/MessageParticipantsList';

type AddToARoomModalProps = {
  afterAdd: (roomInfo: Room) => void;
  user: AuthState;
};

export default function AddToARoomModal({ user, afterAdd }: AddToARoomModalProps) {
  const colors = useThemeColors();
  const styles = createStyles(colors);

  const currentUserId = useSelector((state: RootState) => state.authState.userId);
  const [rooms, setRooms] = useState<Room[]>([]);

  useEffect(() => {
    (async () => {
      let rooms = await getMyRooms(currentUserId);

      if (!rooms) {
        Alert.alert('Something wrong happened.', 'An error occurred please retry later.');
        return;
      }

      rooms = rooms.filter((room) => !room.participants_id.includes(user.userId));

      setRooms(rooms);
    })();
  }, [currentUserId, user]);

  const renderItem = useCallback(
    ({ item }: { item: Room }) => (
      <MessageParticipantsList
        roomInfo={item}
        onPress={async () => {
          const updateRoomRequest: UpdateRoomRequest = {
            room_id: item.room_id,
            users_to_add: [user.userId],
            users_to_remove: [],
          };

          await updateParticipant(updateRoomRequest);

          store.dispatch(setShouldRefecthMessages(true));

          const roomWithNewParticipant = {
            ...item,
            participants: [...item.participants, user],
            participants_id: [...item.participants_id, user.userId],
          };
          afterAdd(roomWithNewParticipant);
        }}
      />
    ),
    [user, afterAdd],
  );

  return (
    <FlatList
      data={rooms}
      style={styles.card}
      contentContainerStyle={{ paddingHorizontal: 16, flex: 1 }}
      renderItem={renderItem}
      ListEmptyComponent={
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No group found to add user.</Text>
        </View>
      }
    />
  );
}

const createStyles = (colors: ColorTheme) =>
  StyleSheet.create({
    card: {
      backgroundColor: colors.background,
      borderWidth: 1,
      borderRadius: 8,
      elevation: 4,
    },

    emptyContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    emptyText: {
      fontSize: 16,
      color: colors.textSecondary,
      textAlign: 'center',
    },
  });
