import * as React from 'react';
import { FlatList, Pressable, StyleSheet } from 'react-native';

import { InsideStackScreenProps } from '@navigation/Types';
import { Image } from 'expo-image';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function ImageListScreen({
  navigation,
  route,
}: InsideStackScreenProps<'ImageList'>) {
  const images = route.params.images;

  const renderItem = ({ item, index }: { item: string; index: number }) => (
    <Pressable
      style={styles.imageWrapper}
      onPress={() => navigation.navigate('ImageGallery', { images, index })}>
      <Image source={{ uri: item }} style={styles.image} contentFit="cover" transition={300} />
    </Pressable>
  );

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <FlatList
        data={images}
        keyExtractor={(item) => item}
        renderItem={renderItem}
        contentContainerStyle={styles.listContent}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  listContent: {
    padding: 8,
  },
  imageWrapper: {
    overflow: 'hidden',
    marginBottom: 10,
    elevation: 3,
  },
  image: {
    width: '100%',
    height: 250,
    borderRadius: 4,
  },
});
