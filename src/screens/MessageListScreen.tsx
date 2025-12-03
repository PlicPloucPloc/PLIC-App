import React, { useCallback, useEffect, useState } from 'react';
import { FlatList, StyleSheet, Text, View, RefreshControl } from 'react-native';

import { useFocusEffect } from '@react-navigation/native';
import { useSelector } from 'react-redux';

import { ColorTheme } from '@app/Colors';
import { Room } from '@app/definitions/rest/ChatService';
import { useThemeColors } from '@app/hooks/UseThemeColor';
import { setShouldRefecthMessages } from '@app/redux/slices';
import store, { RootState } from '@app/redux/Store';
import { getAllRooms } from '@app/rest/ChatService';
import MessageListParticipants from '@components/MessageParticipantsList';
import Separator from '@components/Separator';
import { MessageStackScreenProps } from '@navigation/Types';

export default function MessageListScreen({ navigation }: MessageStackScreenProps<'MessageList'>) {
  const colors = useThemeColors();
  const styles = createStyles(colors);

  const currentUserId = useSelector((state: RootState) => state.authState.userId);

  const [refreshing, setRefreshing] = useState(false);
  const [rooms, setRooms] = useState<Room[]>([]);

  const fetchRooms = useCallback(async () => {
    setRefreshing(true);
    const rooms = await getAllRooms(currentUserId).finally(() => setRefreshing(false));
    setRooms(rooms);
  }, [currentUserId]);

  useEffect(() => {
    fetchRooms();
  }, [fetchRooms]);

  const shouldRefetch = useSelector((state: RootState) => state.appState.shouldRefecthMessages);

  useFocusEffect(
    useCallback(() => {
      if (shouldRefetch) {
        fetchRooms();
        store.dispatch(setShouldRefecthMessages(false));
      }
    }, [fetchRooms, shouldRefetch]),
  );

  const renderItem = useCallback(
    ({ item }: { item: Room }) => (
      <MessageListParticipants
        roomInfo={item}
        onPress={() =>
          navigation.navigate('SharedStack', {
            screen: 'Message',
            params: { roomInfo: item },
          })
        }
      />
    ),
    [navigation],
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={rooms}
        renderItem={renderItem}
        contentContainerStyle={{ paddingHorizontal: 16 }}
        ItemSeparatorComponent={Separator}
        ListEmptyComponent={
          <Text style={{ color: colors.textSecondary, textAlign: 'center', marginTop: 20 }}>
            No chat found.
          </Text>
        }
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={fetchRooms}
            colors={[colors.primary]}
            tintColor={colors.textPrimary}
          />
        }
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
  });
