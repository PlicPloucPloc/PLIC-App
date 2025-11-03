import { useCallback, useRef, useState } from 'react';
import * as React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { Image } from 'expo-image';
import AwesomeGallery, { GalleryRef, RenderItemInfo } from 'react-native-awesome-gallery';
import Animated, { FadeInDown, FadeOutDown } from 'react-native-reanimated';

import { ColorTheme } from '@app/Colors';
import { useThemeColors } from '@app/hooks/UseThemeColor';
import { InsideStackScreenProps } from '@navigation/Types';

export default function ImageGalleryScreen({
  navigation,
  route,
}: InsideStackScreenProps<'ImageGallery'>) {
  const colors = useThemeColors();
  const styles = createStyles(colors);

  const params = route.params;
  const gallery = useRef<GalleryRef>(null);

  const [infoVisible, setInfoVisible] = useState(true);

  const onIndexChange = useCallback(
    (index: number) => {
      navigation.setParams({ index });
    },
    [navigation],
  );

  const renderItem = ({ item, setImageDimensions }: RenderItemInfo<{ uri: string }>) => {
    return (
      <Image
        source={item.uri}
        style={StyleSheet.absoluteFillObject}
        contentFit="contain"
        onLoad={(e) => {
          const { width, height } = e.source;
          setImageDimensions({ width, height });
        }}
      />
    );
  };

  return (
    <View style={styles.container}>
      <AwesomeGallery
        ref={gallery}
        data={params.images.map((uri) => ({ uri }))}
        keyExtractor={(item) => item.uri}
        renderItem={renderItem}
        initialIndex={params.index}
        numToRender={3}
        doubleTapInterval={150}
        onIndexChange={onIndexChange}
        onSwipeToClose={navigation.goBack}
        onTap={() => {
          setInfoVisible(!infoVisible);
        }}
        loop={false}
        style={{ backgroundColor: colors.background }}
        onScaleEnd={(scale) => {
          if (scale < 0.8) {
            navigation.goBack();
          }
        }}
      />
      {infoVisible && (
        <Animated.View
          entering={FadeInDown.duration(250)}
          exiting={FadeOutDown.duration(250)}
          style={styles.toolbar}>
          <View style={styles.buttonsContainer}>
            <TouchableOpacity
              disabled={params.index === 0}
              style={[styles.textContainer, { opacity: params.index === 0 ? 0.5 : 1 }]}
              onPress={() =>
                gallery.current?.setIndex(
                  params.index === 0 ? params.images.length - 1 : params.index - 1,
                  true,
                )
              }>
              <Text style={styles.text}>Previous</Text>
            </TouchableOpacity>

            <View style={styles.textContainer}>
              <Text style={styles.text}>
                {params.index + 1} of {params.images.length}
              </Text>
            </View>

            <TouchableOpacity
              disabled={params.index == params.images.length - 1}
              style={[
                styles.textContainer,
                { opacity: params.index == params.images.length - 1 ? 0.5 : 1 },
              ]}
              onPress={() =>
                gallery.current?.setIndex(
                  Math.min(params.images.length - 1, params.index + 1),
                  true,
                )
              }>
              <Text style={styles.text}>Next</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      )}
    </View>
  );
}

const createStyles = (_: ColorTheme) =>
  StyleSheet.create({
    container: {
      flex: 1,
    },
    textContainer: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
    },
    text: {
      fontSize: 20,
      fontWeight: 'bold',
      color: 'white',
    },
    buttonsContainer: {
      flex: 1,
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
    toolbar: {
      position: 'absolute',
      width: '100%',
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      zIndex: 1,
      height: 100,
      bottom: 0,
    },
  });
