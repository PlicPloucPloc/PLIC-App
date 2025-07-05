import React, { useCallback, useEffect, useState } from 'react';
import {
  FlatList,
  Keyboard,
  Pressable,
  RefreshControl,
  StyleSheet,
  TextInput,
  TouchableWithoutFeedback,
  View,
} from 'react-native';

import { ColorTheme } from '@app/Colors';
import { ApartmentInfo } from '@app/definitions';
import { useThemeColors } from '@app/hooks/UseThemeColor';
import { getLikedApartmentsPaginated } from '@app/rest/RelationService';
import LikeItem from '@components/LikeItem';
import { LikesStackScreenProps } from '@navigation/Types';

export default function LikesListScreen({ navigation }: LikesStackScreenProps<'LikesList'>) {
  const colors = useThemeColors();
  const styles = createStyles(colors);

  const [data, setData] = useState<ApartmentInfo[]>([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');

  const fetchInitialData = useCallback(async () => {
    setLoading(true);
    const apartmentsResponse = await getLikedApartmentsPaginated(true, 0);
    if (!apartmentsResponse) return;

    setData(apartmentsResponse);

    setLoading(false);
  }, []);

  const fetchMoreData = useCallback(async () => {
    if (loading) return;

    const apartmentsResponse = await getLikedApartmentsPaginated(true, data.length);
    if (!apartmentsResponse) return;

    setData((prevData) => [...prevData, ...apartmentsResponse]);
  }, [data.length, loading]);

  useEffect(() => {
    fetchInitialData();
  }, [fetchInitialData]);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      fetchInitialData();
    });
    return unsubscribe;
  }, [fetchInitialData, navigation]);

  const filteredData = data.filter((apt) => apt.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <View style={styles.container}>
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
        keyExtractor={(apt) => apt.name}
        renderItem={({ item: apt }) => (
          <Pressable
            onPress={() =>
              navigation.navigate('SharedStack', {
                screen: 'ApartmentDetails',
                params: { apartment: apt },
              })
            }
            // android_ripple={{ color: colors.primary + '33' }}
            // style={({ pressed }) => [
            //   {
            //     opacity: pressed ? 0.6 : 1,
            //   },
            // ]}
          >
            <LikeItem
              title={apt.name}
              surface={apt.surface}
              description={apt.description}
              imageUrl={apt.image_thumbnail}
            />
          </Pressable>
        )}
        refreshControl={<RefreshControl refreshing={loading} onRefresh={fetchInitialData} />}
        onEndReached={fetchMoreData}
        onEndReachedThreshold={0.75}
        contentContainerStyle={{ paddingBottom: 20 }}
        keyboardShouldPersistTaps="handled"
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
  });
