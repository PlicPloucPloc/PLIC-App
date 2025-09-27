import React, { useCallback, useMemo } from 'react';
import { ActivityIndicator, Alert, FlatList, RefreshControl, StyleSheet, Text } from 'react-native';

import { ColorTheme } from '@app/Colors';
import { RelationInfo } from '@app/definitions';
import { usePaginatedQuery } from '@app/hooks/UsePaginatedQuery';
import { useThemeColors } from '@app/hooks/UseThemeColor';
import { setShouldRefetchHistory, setShouldRefetchLikeList } from '@app/redux/slices';
import store, { RootState } from '@app/redux/Store';
import { deleteRelation } from '@app/rest/RelationService';
import { useFocusEffect } from '@react-navigation/native';
import { useSelector } from 'react-redux';

import ApartmentListRow from './ApartmentListRow';

type ApartmentListProps = {
  navigation: any;
  search: string;
  fetchData: (offset: number) => Promise<RelationInfo[]>;
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
    refreshing,
    fetchMore,
  } = usePaginatedQuery<RelationInfo>(fetchData);

  const filteredRelations = useMemo(() => {
    if (!search) return relations;
    const lowerSearch = search.toLowerCase();
    return relations.filter(
      (r) =>
        r.apt.name.toLowerCase().includes(lowerSearch) ||
        r.apt.location.toLowerCase().includes(lowerSearch),
    );
  }, [relations, search]);

  const shouldRefetch = useSelector((state: RootState) =>
    isHistory ? state.appState.shouldRefetchHistory : state.appState.shouldRefetchLikeList,
  );

  useFocusEffect(
    useCallback(() => {
      if (shouldRefetch) {
        refresh();
        if (isHistory) {
          store.dispatch(setShouldRefetchHistory(false));
        } else {
          store.dispatch(setShouldRefetchLikeList(false));
        }
      }
    }, [refresh, shouldRefetch, isHistory]),
  );

  const handleDeleteRelation = useCallback(
    async (apartment_id: number) => {
      const deleted = await deleteRelation(apartment_id);
      if (deleted) {
        setRelations((prev) =>
          prev.filter((relation) => relation.apt.apartment_id !== apartment_id),
        );
      } else {
        Alert.alert('Error', 'Failed to delete the apartment from your likes.');
      }
    },
    [setRelations],
  );

  const handlePress = useCallback(
    (relation: RelationInfo) => {
      navigation.navigate('SharedStack', {
        screen: 'ApartmentDetails',
        params: { apartment: relation.apt, enableRelationButtons: false },
      });
    },
    [navigation],
  );

  const renderItem = useCallback(
    ({ item }: { item: RelationInfo }) => (
      <ApartmentListRow
        relation={item}
        onPress={handlePress}
        onDelete={handleDeleteRelation}
        isHistory={isHistory}
      />
    ),
    [handlePress, handleDeleteRelation, isHistory],
  );

  if (relations.length === 0) {
    return <Text style={styles.text}>No apartments found.</Text>;
  }

  return (
    <FlatList
      data={filteredRelations}
      keyExtractor={(relation) => relation.apt.apartment_id.toString()}
      style={{ flex: 1 }}
      contentContainerStyle={{ paddingBottom: 20, flexGrow: 1 }}
      renderItem={renderItem}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={refresh}
          colors={[colors.primary]}
          tintColor={colors.primary}
        />
      }
      onEndReached={() => fetchMore()}
      onEndReachedThreshold={0.2}
      ListFooterComponent={
        loadingMore ? (
          <ActivityIndicator size="small" color={colors.primary} style={{ marginVertical: 20 }} />
        ) : null
      }
    />
  );
}

const createStyles = (colors: ColorTheme) =>
  StyleSheet.create({
    text: {
      flex: 1,
      textAlign: 'center',
      marginTop: 20,
      color: colors.textSecondary,
      fontSize: 16,
      fontWeight: '500',
    },
  });
