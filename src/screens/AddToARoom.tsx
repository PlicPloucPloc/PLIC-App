import React, { useCallback, useEffect, useState } from 'react';
import { Alert, FlatList, StyleSheet, Text, View } from 'react-native';

import { useSelector } from 'react-redux';

import { ColorTheme } from '@app/Colors';
import { Room, UpdateRoomRequest } from '@app/definitions/rest/ChatService';
import { useThemeColors } from '@app/hooks/UseThemeColor';
import { RootState } from '@app/redux/Store';
import { updateParticipant, getMyRooms } from '@app/rest/ChatService';
import MessageParticipantsList from '@components/MessageParticipantsList';
import { SharedStackScreenProps } from '@navigation/Types';

export default function AddToARoomScreen({
  navigation,
  route,
}: SharedStackScreenProps<'AddToARoom'>) {
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

      rooms = rooms.filter((room) => !room.participants_id.includes(route.params.user.userId));

      setRooms(rooms);
    })();
  }, [currentUserId, route.params.user]);

  const renderItem = useCallback(
    ({ item }: { item: Room }) => (
      <MessageParticipantsList
        roomInfo={item}
        onPress={() => {
          const updateRoomRequest: UpdateRoomRequest = {
            room_id: item.room_id,
            users_to_add: [route.params.user.userId],
            users_to_remove: [],
          };

          updateParticipant(updateRoomRequest);
          navigation.navigate('SharedStack', {
            screen: 'OtherProfile',
            params: { userId: route.params.user.userId },
          });
        }}
      />
    ),
    [navigation, route.params.user],
  );

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Text>
          <Text>Select a chat to add </Text>
          <Text style={{ fontWeight: 'bold' }}>
            {route.params.user.firstName} {route.params.user.lastName}
          </Text>
          <Text> as a new member.</Text>
        </Text>
      </View>

      <FlatList
        data={rooms}
        contentContainerStyle={{ paddingHorizontal: 16 }}
        renderItem={renderItem}
      />
    </View>
  );
}

const createStyles = (colors: ColorTheme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    headerContainer: {
      paddingHorizontal: 16,
      paddingVertical: 12,
      borderBottomWidth: 1,
      borderBottomColor: '#eee',
    },
    headerTitle: {
      fontSize: 14,
      color: colors.textSecondary,
      fontWeight: '500',
    },
  });
