import React, { useCallback, useEffect, useState } from 'react';
import { FlatList, StyleSheet, Text, View, RefreshControl } from 'react-native';

import { useSelector } from 'react-redux';

import { ColorTheme } from '@app/Colors';
import { Room } from '@app/definitions/rest/ChatService';
import { useThemeColors } from '@app/hooks/UseThemeColor';
import { RootState } from '@app/redux/Store';
import { getAllRooms } from '@app/rest/ChatService';
import ListMessageParticipants from '@components/MessageParticipantsList';
import Separator from '@components/Separator';
import { MessageStackScreenProps } from '@navigation/Types';

export default function DirectMessageListScreen({
  navigation,
}: MessageStackScreenProps<'DirectMessageList'>) {
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

  const renderItem = useCallback(
    ({ item }: { item: Room }) => (
      <ListMessageParticipants
        roomInfo={item}
        onPress={() =>
          navigation.navigate('SharedStack', {
            screen: 'DirectMessage',
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
