import React, { useCallback, useEffect, useState } from 'react';
import {
  Alert,
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
import { ApartmentResponse } from '@app/definitions';
import { useThemeColors } from '@app/hooks/UseThemeColor';
import { getApartments } from '@app/rest/ApartmentService';
import LikeItem from '@components/LikeItem';
import { LikesStackScreenProps } from '@navigation/Types';

export default function LikesListScreen({ navigation }: LikesStackScreenProps<'LikesList'>) {
  const colors = useThemeColors();
  const styles = createStyles(colors);

  const [data, setData] = useState<ApartmentResponse[]>([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');

  const fetchData = useCallback(async () => {
    setLoading(true);
    const response = await getApartments();

    if (!response.ok) {
      const errorData = await response.json();
      Alert.alert(
        'Apartment Error',
        errorData.message || 'An error occurred while fetching the apartments.',
      );
      return;
    }

    const apartmentsResponse: ApartmentResponse[] = await response.json();

    setData(apartmentsResponse);

    setLoading(false);
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const filteredData = data.filter((item) =>
    item.additional_info.title.toLowerCase().includes(search.toLowerCase()),
  );

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
        keyExtractor={(item) => item.adLink}
        renderItem={({ item }) => (
          <Pressable
            onPress={() =>
              navigation.navigate('SharedStack', {
                screen: 'ApartmentDetails',
                params: { apartment: item },
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
              title={item.additional_info.title}
              surface={item.additional_info.criteria.surface}
              description={item.additional_info.description}
              imageUrl={item.additional_info.images.thumb_url}
            />
          </Pressable>
        )}
        refreshControl={<RefreshControl refreshing={loading} onRefresh={fetchData} />}
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
