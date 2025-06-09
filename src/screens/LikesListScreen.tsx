import React, { useCallback, useEffect, useState } from 'react';
import {
  FlatList,
  Keyboard,
  RefreshControl,
  StyleSheet,
  TextInput,
  TouchableWithoutFeedback,
  View,
} from 'react-native';

import { ColorTheme } from '@app/Colors';
import { useThemeColors } from '@app/hooks/UseThemeColor';
import LikeItem from '@components/LikeItem';
import { LikesStackScreenProps } from '@navigation/Types';

type Apartment = {
  id: string;
  title: string;
  price: string;
  description: string;
  imageUrl: string;
};

export default function LikesListScreen({ navigation }: LikesStackScreenProps<'LikesList'>) {
  const colors = useThemeColors();
  const styles = createStyles(colors);

  const [data, setData] = useState<Apartment[]>([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');

  const fetchData = useCallback(async () => {
    setLoading(true);

    // Simulate API call
    await new Promise((res) => setTimeout(res, 1000));
    const mockData: Apartment[] = Array.from({ length: 10 }).map((_, i) => ({
      id: `${i}`,
      title: `Apartment ${i + 1}`,
      price: `$${1000 + i * 100}/month`,
      description: `Spacious and modern apartment ${i + 1}`,
      imageUrl: 'https://picsum.photos/800/1000',
    }));

    setData(mockData);
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const filteredData = data.filter((item) =>
    item.title.toLowerCase().includes(search.toLowerCase()),
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
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <LikeItem
            title={item.title}
            price={item.price}
            description={item.description}
            imageUrl={item.imageUrl}
          />
        )}
        refreshControl={<RefreshControl refreshing={loading} onRefresh={fetchData} />}
        contentContainerStyle={{ paddingBottom: 20 }}
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
