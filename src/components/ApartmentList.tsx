import React, { useCallback } from 'react';
import {
  ActivityIndicator,
  Alert,
  Animated,
  FlatList,
  Pressable,
  RefreshControl,
  StyleSheet,
  Text,
  TouchableOpacity,
} from 'react-native';

import { ColorTheme } from '@app/Colors';
import { RelationInfo } from '@app/definitions/rest/RelationService';
import { usePaginatedQuery } from '@app/hooks/UsePaginatedQuery';
import { useThemeColors } from '@app/hooks/UseThemeColor';
import { setShouldRefetchLiked } from '@app/redux/slices';
import store, { RootState } from '@app/redux/Store';
import { deleteRelation } from '@app/rest/RelationService';
import { useFocusEffect } from '@react-navigation/native';
import { Swipeable } from 'react-native-gesture-handler';
import { useSelector } from 'react-redux';

import ApartmentListItem from './ApartmentListItem';

const PAGE_SIZE = 10;

type ApartmentListProps = {
  navigation: any;
  search: string;
  fetchData: (offset: number, pageSize: number) => Promise<RelationInfo[]>;
  isHistory: boolean;
};

export default function ApartmentList({
  navigation,
  search,
  fetchData,
  isHistory,
}: ApartmentListProps) {
  const colors = useThemeColors();
  const styles = createStyles(colors);
  const {
    data: relations,
    setData: setRelations,
    loadingMore,
    refresh,
    fetchMore,
    refreshing,
  } = usePaginatedQuery<RelationInfo>(fetchData, PAGE_SIZE);

  const shouldRefetch = useSelector((state: RootState) => state.appState.shouldRefetchLiked);

  useFocusEffect(
    useCallback(() => {
      if (shouldRefetch) {
        refresh();
        store.dispatch(setShouldRefetchLiked(false));
      }
    }, [refresh, shouldRefetch]),
  );

  const filteredRelations = relations.filter(
    (relation) =>
      relation.apt.name.toLowerCase().includes(search.toLowerCase()) ||
      relation.apt.location.toLowerCase().includes(search.toLowerCase()),
  );

  const onPressDelete = (apartment_id: number) => {
    Alert.alert(
      'Confirm Deletion',
      'Are you sure you want to delete the apartment from your likes?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => handleDeleteRelation(apartment_id),
        },
      ],
    );
  };

  async function handleDeleteRelation(apartment_id: number) {
    const deleted = await deleteRelation(apartment_id);
    if (deleted) {
      setRelations((prev) => prev.filter((relation) => relation.apt.apartment_id !== apartment_id));
    } else {
      Alert.alert('Error', 'Failed to delete the apartment from your likes.');
    }
  }

  return (
    <FlatList
      data={filteredRelations}
      keyExtractor={(relation) => relation.apt.name}
      style={{ flex: 1 }}
      contentContainerStyle={{ paddingBottom: 20, flexGrow: 1 }}
      renderItem={({ item: relation }) => (
        <Swipeable
          renderLeftActions={(progress) => {
            const translateX = progress.interpolate({
              inputRange: [0, 1],
              outputRange: [-100, 0],
            });

            return (
              <Animated.View style={[styles.rightAction, { transform: [{ translateX }] }]}>
                <TouchableOpacity
                  onPress={() => onPressDelete(relation.apt.apartment_id)}
                  style={styles.actionTouchable}>
                  <Text style={styles.actionText}>Delete</Text>
                </TouchableOpacity>
              </Animated.View>
            );
          }}>
          <Pressable
            onPress={() =>
              navigation.navigate('SharedStack', {
                screen: 'ApartmentDetails',
                params: { apartment: relation.apt, enableRelationButtons: true },
              })
            }>
            <ApartmentListItem
              title={relation.apt.name}
              surface={relation.apt.surface}
              rent={relation.apt.rent}
              location={relation.apt.location}
              imageUrl={relation.apt.image_thumbnail}
              relationType={isHistory ? relation.type : undefined}
            />
          </Pressable>
        </Swipeable>
      )}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={refresh}
          colors={[colors.primary]}
          tintColor={colors.primary}
        />
      }
      onEndReached={fetchMore}
      onEndReachedThreshold={0.2}
      ListFooterComponent={
        loadingMore ? (
          <ActivityIndicator size="small" color={colors.primary} style={{ marginVertical: 20 }} />
        ) : null
      }
    />
  );
}

const createStyles = (_: ColorTheme) =>
  StyleSheet.create({
    rightAction: {
      width: 100,
      height: '100%',
      justifyContent: 'center',
      alignItems: 'center',
      padding: 10,
    },
    actionTouchable: {
      flex: 1,
      width: '100%',
      justifyContent: 'center',
      alignItems: 'center',
      borderRadius: 10,
      backgroundColor: 'red',
    },
    actionText: {
      color: '#fff',
      fontWeight: 'bold',
    },
  });
