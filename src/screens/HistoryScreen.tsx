import React, { useCallback, useEffect, useState } from 'react';
import {
  Alert,
  Animated,
  FlatList,
  Keyboard,
  Pressable,
  RefreshControl,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';

import { ColorTheme } from '@app/Colors';
import { RELATION_TYPE, RelationInfo } from '@app/definitions/rest/RelationService';
import { useThemeColors } from '@app/hooks/UseThemeColor';
import { deleteRelation, getAllRelationsPaginated } from '@app/rest/RelationService';
import LikeItem from '@components/LikeItem';
import { ProfilStackScreenProps } from '@navigation/Types';
import { GestureHandlerRootView, Swipeable } from 'react-native-gesture-handler';

export default function HistoryScreen({ navigation }: ProfilStackScreenProps<'History'>) {
  const colors = useThemeColors();
  const styles = createStyles(colors);

  const [data, setData] = useState<RelationInfo[]>([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');

  const fetchInitialData = useCallback(async () => {
    setLoading(true);
    const response = await getAllRelationsPaginated(0);
    if (response) {
      setData(response);
    }
    setLoading(false);
  }, []);

  const fetchMoreData = useCallback(async () => {
    if (loading) return;
    const response = await getAllRelationsPaginated(data.length);
    if (response) {
      setData((prev) => [...prev, ...response]);
    }
  }, [data.length, loading]);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      fetchInitialData();
    });
    return unsubscribe;
  }, [fetchInitialData, navigation]);

  async function handleDeleteRelation(apartment_id: number) {
    setLoading(true);
    const deleted = await deleteRelation(apartment_id);
    if (deleted) {
      setData((prev) => prev.filter((apt) => apt.apt.apartment_id !== apartment_id));
    } else {
      Alert.alert('Error', 'Failed to delete the apartment from your history.');
    }
    setLoading(false);
  }

  function onPressDelete(apartment_id: number) {
    Alert.alert(
      'Confirm Deletion',
      'Are you sure you want to delete this apartment from your history?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => handleDeleteRelation(apartment_id),
        },
      ],
    );
  }

  function renderRightAction(
    progress: Animated.AnimatedInterpolation<number>,
    apartment_id: number,
  ) {
    const translateX = progress.interpolate({
      inputRange: [0, 1],
      outputRange: [100, 0],
    });

    return (
      <Animated.View style={[styles.rightAction, { transform: [{ translateX }] }]}>
        <TouchableOpacity
          onPress={() => onPressDelete(apartment_id)}
          style={styles.actionTouchable}>
          <Text style={styles.actionText}>Delete</Text>
        </TouchableOpacity>
      </Animated.View>
    );
  }

  const filteredData = data.filter((apt) =>
    apt.apt.name.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <GestureHandlerRootView style={styles.container}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.topContainer}>
          <TextInput
            placeholder="Search..."
            value={search}
            onChangeText={setSearch}
            style={styles.searchBar}
          />
        </View>
      </TouchableWithoutFeedback>

      <FlatList
        data={filteredData}
        keyExtractor={(apt) => apt.apt.name}
        renderItem={({ item: apt }) => (
          <Swipeable
            renderRightActions={(progress) => renderRightAction(progress, apt.apt.apartment_id)}>
            <Pressable
              onPress={() =>
                navigation.navigate('SharedStack', {
                  screen: 'ApartmentDetails',
                  params: { apartment: apt.apt },
                })
              }>
              <View
                style={[
                  styles.itemWrapper,
                  {
                    backgroundColor: apt.type == RELATION_TYPE.LIKE ? '#d0f5dd' : '#fddddd',
                  },
                ]}>
                <LikeItem
                  title={apt.apt.name}
                  surface={apt.apt.surface}
                  description={apt.apt.description}
                  imageUrl={apt.apt.image_thumbnail}
                />
              </View>
            </Pressable>
          </Swipeable>
        )}
        refreshControl={<RefreshControl refreshing={loading} onRefresh={fetchInitialData} />}
        onEndReached={fetchMoreData}
        onEndReachedThreshold={0.75}
        contentContainerStyle={{ paddingBottom: 20 }}
        keyboardShouldPersistTaps="handled"
      />
    </GestureHandlerRootView>
  );
}

const createStyles = (colors: ColorTheme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    topContainer: {
      paddingHorizontal: 20,
      paddingVertical: 10,
      backgroundColor: colors.background,
    },
    searchBar: {
      padding: 12,
      borderWidth: 1,
      borderColor: '#ccc',
      borderRadius: 100,
      fontSize: 15,
    },
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
    itemWrapper: {
      paddingVertical: 5,
    },
  });
