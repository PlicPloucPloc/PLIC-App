import React, { useCallback, useRef } from 'react';
import { Image, type ImageSourcePropType, StyleSheet, Text, View } from 'react-native';

import ActionButton from '@components/ActionButton';
import { Ionicons } from '@expo/vector-icons';
import { HomeStackScreenProps } from '@navigation/Types';
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';
import { Swiper, type SwiperCardRefType } from 'rn-swiper-list';

const IMAGES: ImageSourcePropType[] = [
  require('../../assets/tmp/1.png'),
  require('../../assets/tmp/2.png'),
  require('../../assets/tmp/3.png'),
  require('../../assets/tmp/4.png'),
  require('../../assets/tmp/5.png'),
  require('../../assets/tmp/6.png'),
  require('../../assets/tmp/7.png'),
];

const ICON_SIZE = 38;

export default function HomeScreen({ navigation }: HomeStackScreenProps<'Home'>) {
  const ref = useRef<SwiperCardRefType>();

  const renderCard = useCallback((image: ImageSourcePropType) => {
    return <Image source={image} style={styles.renderCardImage} resizeMode="cover" />;
  }, []);

  const OverlayLabelRight = useCallback(() => {
    return <View style={[styles.overlayLabelContainer, { backgroundColor: '#4BA3C3' }]} />;
  }, []);

  const OverlayLabelLeft = useCallback(() => {
    return <View style={[styles.overlayLabelContainer, { backgroundColor: 'red' }]} />;
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.swiperContainer}>
        <TouchableWithoutFeedback
          style={styles.touchableContainer}
          onPress={() => {
            navigation.navigate('SharedStack', {
              screen: 'HouseDetails',
              params: { houseId: 69 },
            });
          }}>
          <Swiper
            ref={ref}
            cardStyle={styles.cardStyle}
            data={IMAGES}
            renderCard={renderCard}
            disableBottomSwipe={true}
            disableTopSwipe={true}
            onIndexChange={(index) => {
              // console.log('Current Active index', index);
            }}
            onSwipeRight={(cardIndex) => {
              // console.log('cardIndex', cardIndex);
            }}
            onSwipeLeft={(cardIndex) => {
              // console.log('onSwipeLeft', cardIndex);
            }}
            onSwipedAll={() => {
              // console.log('onSwipedAll');
            }}
            OverlayLabelRight={OverlayLabelRight}
            OverlayLabelLeft={OverlayLabelLeft}
          />
        </TouchableWithoutFeedback>
      </View>

      <View style={styles.textContainer}>
        <Text style={styles.textTitle}>T2 proche de Bastille</Text>
        <Text style={styles.textSubtitle}>720€ (830€ - 900€) </Text>
      </View>

      <View style={styles.buttonsContainer}>
        <ActionButton
          style={styles.button}
          onTap={() => {
            ref.current?.swipeBack();
          }}>
          <Ionicons name="arrow-undo" size={ICON_SIZE - 10} color="black" />
        </ActionButton>
        <ActionButton
          style={styles.button}
          onTap={() => {
            ref.current?.swipeLeft();
          }}>
          <Ionicons name="close" size={ICON_SIZE} color="red" />
        </ActionButton>
        <ActionButton
          style={styles.button}
          onTap={() => {
            ref.current?.swipeRight();
          }}>
          <Ionicons name="heart" size={ICON_SIZE} color="#7EC0FD" />
        </ActionButton>
        <ActionButton
          style={styles.button}
          onTap={() => {
            ref.current?.swipeTop();
          }}>
          <Ionicons name="chatbox-outline" size={ICON_SIZE - 10} color="black" />
        </ActionButton>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'white',
  },

  swiperContainer: {
    flex: 7,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
  touchableContainer: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardStyle: {
    width: '95%',
    height: '95%',
    borderRadius: 15,
    marginVertical: 20,
  },
  renderCardImage: {
    height: '100%',
    width: '100%',
    borderRadius: 15,
  },
  overlayLabelContainer: {
    flex: 1,
    width: '100%',
    height: '100%',
    borderRadius: 15,
    opacity: 0.5,
  },

  textContainer: {
    flex: 1,
    paddingLeft: 20,
  },
  textTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  textSubtitle: {
    fontSize: 22,
  },

  buttonsContainer: {
    flex: 1,
    paddingVertical: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-evenly',
  },
  button: {
    padding: 10,
    borderRadius: 40,
    aspectRatio: 1,
    backgroundColor: 'white',
    elevation: 4,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: 'black',
  },
  buttonText: {
    fontSize: 20,
    fontWeight: 'bold',
  },
});
