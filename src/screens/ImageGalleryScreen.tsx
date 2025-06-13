import { useCallback, useEffect, useRef, useState } from 'react';
import * as React from 'react';
import { StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { InsideStackScreenProps } from '@navigation/Types';
import { useIsFocused } from '@react-navigation/native';
import { Image } from 'expo-image';
import AwesomeGallery, { GalleryRef, RenderItemInfo } from 'react-native-awesome-gallery';
import Animated, { FadeInDown, FadeInUp, FadeOutDown, FadeOutUp } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

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

export default function ImageGalleryScreen({
  navigation,
  route,
}: InsideStackScreenProps<'ImageGallery'>) {
  const { top, bottom } = useSafeAreaInsets();

  const params = route.params;
  const isFocused = useIsFocused();
  const gallery = useRef<GalleryRef>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const [infoVisible, setInfoVisible] = useState(true);

  useEffect(() => {
    StatusBar.setBarStyle(isFocused ? 'light-content' : 'dark-content', true);
    if (!isFocused) {
      StatusBar.setHidden(false, 'fade');
    }
  }, [isFocused]);

  const onIndexChange = useCallback(
    (index: number) => {
      isFocused && navigation.setParams({ index });
    },
    [isFocused, navigation],
  );

  const onTap = () => {
    StatusBar.setHidden(infoVisible, 'slide');
    setInfoVisible(!infoVisible);
  };

  return (
    <View style={styles.container}>
      {infoVisible && (
        <Animated.View
          entering={mounted ? FadeInUp.duration(250) : undefined}
          exiting={FadeOutUp.duration(250)}
          style={[
            styles.toolbar,
            {
              height: top + 60,
              paddingTop: top,
            },
          ]}>
          <View style={styles.textContainer}>
            <Text style={styles.headerText}>
              {params.index + 1} of {params.images.length}
            </Text>
          </View>
        </Animated.View>
      )}
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
        onTap={onTap}
        loop={false}
        onScaleEnd={(scale) => {
          if (scale < 0.8) {
            navigation.goBack();
          }
        }}
      />
      {infoVisible && (
        <Animated.View
          entering={mounted ? FadeInDown.duration(250) : undefined}
          exiting={FadeOutDown.duration(250)}
          style={[
            styles.toolbar,
            styles.bottomToolBar,
            {
              height: bottom + 100,
              paddingBottom: bottom,
            },
          ]}>
          <View style={styles.buttonsContainer}>
            <TouchableOpacity
              disabled={params.index === 0}
              style={[styles.textContainer, { opacity: params.index === 0 ? 0.5 : 1 }]}
              onPress={() =>
                gallery.current?.setIndex(
                  params.index === 0 ? params.images.length - 1 : params.index - 1,
                )
              }>
              <Text style={styles.buttonText}>Previous</Text>
            </TouchableOpacity>
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
              <Text style={styles.buttonText}>Next</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  textContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
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
  },
  bottomToolBar: {
    bottom: 0,
  },
  headerText: {
    fontSize: 16,
    color: 'white',
    fontWeight: '600',
  },
});
