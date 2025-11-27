import React, { useCallback, useEffect, useState } from 'react';
import { FlatList, StyleSheet, Text, TouchableOpacity, View, RefreshControl } from 'react-native';

import { useSelector } from 'react-redux';

import { ColorTheme } from '@app/Colors';
import { Room } from '@app/definitions/rest/ChatService';
import { useThemeColors } from '@app/hooks/UseThemeColor';
import { RootState } from '@app/redux/Store';
import { getAllRooms } from '@app/rest/ChatService';
import MessageListItem from '@components/MessageListItem';
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
      <MessageListItem
        roomInfo={item}
        onPress={() =>
          navigation.navigate('SharedStack', {
            screen: 'DirectMessage',
            params: { roomId: item.room_id },
          })
        }
      />
    ),
    [navigation],
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Messages</Text>
        <TouchableOpacity
          style={styles.roomiesButton}
          onPress={() => navigation.navigate('GroupMessageList')}>
          <Text style={styles.roomiesText}>Group messages</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={rooms}
        renderItem={renderItem}
        contentContainerStyle={{ paddingHorizontal: 16 }}
        ListEmptyComponent={
          <Text style={{ color: colors.textSecondary, textAlign: 'center', marginTop: 20 }}>
            No direct message rooms found.
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
      paddingTop: 50,
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
      backgroundColor: colors.primary,
      paddingVertical: 6,
      paddingHorizontal: 16,
      borderRadius: 20,
    },
    roomiesText: {
      color: colors.textPrimary,
      fontWeight: '600',
    },
  });
