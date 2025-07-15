import React, { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Animated,
  Pressable,
  RefreshControl,
  StyleSheet,
  Text,
  TouchableOpacity,
} from 'react-native';

import { ColorTheme } from '@app/Colors';
import { RelationInfo } from '@app/definitions/rest/RelationService';
import { useThemeColors } from '@app/hooks/UseThemeColor';
import { setShouldRefetchLiked } from '@app/redux/slices';
import store, { RootState } from '@app/redux/Store';
import { deleteRelation } from '@app/rest/RelationService';
import { useFocusEffect } from '@react-navigation/native';
import { FlatList, Swipeable } from 'react-native-gesture-handler';
import { useSelector } from 'react-redux';

import ApartmentListItem from './ApartmentListItem';

const PAGE_SIZE = 10;

type ApartmentListProps = {
  navigation: any;
  search: string;
  fetchData: (offset: number, pageSize: number) => Promise<RelationInfo[] | undefined>;
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

  // ---------- Data Handling ---------- //
  const [relations, setRelations] = useState<RelationInfo[]>([]);

  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [listInitialized, setListInitialized] = useState(false);

  const fetchInitialData = useCallback(async () => {
    setLoading(true);
    setHasMore(true);
    const apartmentsResponse = await fetchData(0, PAGE_SIZE);
    if (apartmentsResponse) {
      setRelations(apartmentsResponse);
      if (apartmentsResponse.length < PAGE_SIZE) {
        setHasMore(false);
      }
    }
    setLoading(false);
  }, [fetchData]);

  const fetchMoreData = useCallback(async () => {
    if (loading || loadingMore || !hasMore) return;

    setLoadingMore(true);
    const apartmentsResponse = await fetchData(relations.length, PAGE_SIZE);
    if (apartmentsResponse) {
      setRelations((prevData) => [...prevData, ...apartmentsResponse]);
      if (apartmentsResponse.length < PAGE_SIZE) {
        setHasMore(false);
      }
    }
    setLoadingMore(false);
  }, [relations.length, loading, loadingMore, fetchData, hasMore]);

  const shouldRefetch = useSelector((state: RootState) => state.appState.shouldRefetchLiked);

  useFocusEffect(
    useCallback(() => {
      if (shouldRefetch) {
        fetchInitialData();
        store.dispatch(setShouldRefetchLiked(false));
      }
    }, [fetchInitialData, shouldRefetch]),
  );

  // ---------- Data Filtering ---------- //
  const filteredRelations = relations.filter(
    (relation) =>
      relation.apt.name.toLowerCase().includes(search.toLowerCase()) ||
      relation.apt.location.toLowerCase().includes(search.toLowerCase()),
  );

  // ---------- Deletion ---------- //
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
    setLoading(true);
    const deleted = await deleteRelation(apartment_id);
    if (deleted) {
      setRelations((prevData) =>
        prevData.filter((relation) => relation.apt.apartment_id !== apartment_id),
      );
    } else {
      Alert.alert('Error', 'Failed to delete the apartment from your likes.');
    }
    setLoading(false);
  }

  return (
    <FlatList
      data={filteredRelations}
      keyExtractor={(relation) => relation.apt.name}
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
              location={relation.apt.location}
              surface={relation.apt.surface}
              rent={relation.apt.rent}
              imageUrl={relation.apt.image_thumbnail}
              relationType={isHistory ? relation.type : undefined}
            />
          </Pressable>
        </Swipeable>
      )}
      refreshControl={
        <RefreshControl
          refreshing={loading}
          colors={[colors.primary]}
          tintColor={colors.primary}
          onRefresh={fetchInitialData}
        />
      }
      onLayout={() => {
        setListInitialized(true);
        console.log('List initialized');
      }}
      onEndReached={() => {
        if (listInitialized) {
          fetchMoreData();
        }
      }}
      onEndReachedThreshold={0}
      ListFooterComponent={
        loadingMore ? (
          <ActivityIndicator size="small" color={colors.primary} style={{ marginVertical: 20 }} />
        ) : null
      }
      contentContainerStyle={{ paddingBottom: 20 }}
      keyboardShouldPersistTaps="handled"
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
