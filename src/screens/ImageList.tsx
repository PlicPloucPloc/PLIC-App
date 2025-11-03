import * as React from 'react';
import { FlatList, Pressable, StyleSheet, View } from 'react-native';

import { Image } from 'expo-image';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ColorTheme } from '@app/Colors';
import { useThemeColors } from '@app/hooks/UseThemeColor';
import { InsideStackScreenProps } from '@navigation/Types';

export default function ImageListScreen({
  navigation,
  route,
}: InsideStackScreenProps<'ImageList'>) {
  const colors = useThemeColors();
  const insets = useSafeAreaInsets();
  const styles = createStyles(colors, insets);

  const images = route.params.images;

  const renderItem = ({ item, index }: { item: string; index: number }) => (
    <Pressable
      style={styles.imageWrapper}
      onPress={() => navigation.navigate('ImageGallery', { images, index })}>
      <Image source={{ uri: item }} style={styles.image} contentFit="cover" transition={300} />
    </Pressable>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={images}
        keyExtractor={(item) => item}
        renderItem={renderItem}
        contentContainerStyle={styles.listContent}
      />
    </View>
  );
}

const createStyles = (colors: ColorTheme, insets: { top: number; bottom: number }) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
      paddingTop: insets.top,
      paddingBottom: insets.bottom,
    },
    listContent: {
      paddingHorizontal: 8,
      paddingBottom: 16,
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
