import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { Apartment } from '@app/definitions';
import { useGetApartmentsQuery } from '@app/redux/slices';
import ActionButton from '@components/ActionButton';
import { Ionicons } from '@expo/vector-icons';
import { HomeStackScreenProps } from '@navigation/Types';
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';
import { Swiper, type SwiperCardRefType } from 'rn-swiper-list';

const ICON_SIZE = 38;
const SWIPE_DELAY = 300;

export default function HomeScreen({ navigation }: HomeStackScreenProps<'Home'>) {
  const ref = useRef<SwiperCardRefType>();

  // ============= Hooks ============= //
  const { data: apartmentsTmp, error, isLoading } = useGetApartmentsQuery();

  const [swiperIndex, setSwiperIndex] = useState(0);

  const apartmentsRef = useRef<Apartment[]>([]); // used to render the appart info
  const [apartments, setApartments] = useState<Apartment[]>([]); // used to update the swiper
  const [allSwiped, setAllSwiped] = useState(false);
  const [apartmentInfo, setApartmentInfo] = useState<{
    title?: string;
    surface?: number;
    location?: string;
  }>({});

  useEffect(() => {
    if (!apartmentsTmp) return;

    for (let i = 0; i < apartmentsTmp.length; i++) {
      apartmentsTmp[i].additional_info.images.thumb_url = 'https://picsum.photos/800/1000';
    }

    setApartments(apartmentsTmp);
    apartmentsRef.current = apartmentsTmp;
  }, [apartmentsTmp]);

  const onIndexChange = useCallback((index: number) => {
    // console.log('onIndexChange called with index:', index);
    const currentApartments = apartmentsRef.current;
    if (!currentApartments || index >= currentApartments.length) return;

    setSwiperIndex(index);

    const apartment = currentApartments[index];
    setApartmentInfo({
      title: apartment.additional_info.title,
      surface: apartment.additional_info.criteria.surface,
      location: apartment.location,
    });
  }, []);

  if (isLoading) return <Text>Loading...</Text>;
  if (error) return <Text>Error fetching apartments</Text>;

  return (
    <View style={styles.container}>
      <View style={styles.swiperContainer}>
        {allSwiped && (
          <View style={styles.endScreenContainer}>
            <Text style={styles.modalText}>It looks like you swiped everything!</Text>

            <TouchableOpacity
              style={styles.modalButton}
              activeOpacity={0.7}
              onPress={() => navigation.navigate('ProfilStack', { screen: 'History' })}>
              <Text style={styles.modalButtonText}>View history</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.modalButton, { backgroundColor: '#7EC0FD', marginTop: 10 }]}
              activeOpacity={0.7}
              onPress={() => navigation.navigate('ProfilStack', { screen: 'Filters' })}>
              <Text style={styles.modalButtonText}>Expand filters</Text>
            </TouchableOpacity>
          </View>
        )}
        <TouchableWithoutFeedback
          style={[styles.touchableContainer, allSwiped ? { width: '0%', height: '0%' } : {}]}
          onPress={() =>
            navigation.navigate('SharedStack', {
              screen: 'ApartmentDetails',
              params: { apartment: apartmentsRef.current[swiperIndex] },
            })
          }>
          <Swiper
            ref={ref}
            cardStyle={styles.cardStyle}
            data={apartments}
            disableBottomSwipe={true}
            disableTopSwipe={true}
            onIndexChange={onIndexChange}
            onSwipedAll={() => {
              setTimeout(() => {
                setApartmentInfo({});
                setAllSwiped(true);
              }, SWIPE_DELAY);
              console.log('All cards swiped');
            }}
            renderCard={(apartment: Apartment) => (
              <Image
                source={{ uri: apartment.additional_info.images.thumb_url }}
                style={styles.renderCardImage}
                resizeMode="cover"
              />
            )}
            OverlayLabelRight={() => (
              <View style={[styles.overlayLabelContainer, { backgroundColor: '#4BA3C3' }]} />
            )}
            OverlayLabelLeft={() => (
              <View style={[styles.overlayLabelContainer, { backgroundColor: 'red' }]} />
            )}
          />
        </TouchableWithoutFeedback>
      </View>

      <View style={styles.textContainer}>
        {Object.keys(apartmentInfo).length !== 0 && (
          <>
            <Text numberOfLines={1} ellipsizeMode="tail" style={styles.textTitle}>
              {apartmentInfo.title}
            </Text>
            <Text numberOfLines={1} ellipsizeMode="tail" style={styles.textSubtitle}>
              {apartmentInfo.location}
            </Text>
            <Text numberOfLines={1} ellipsizeMode="tail" style={styles.textSubtitle}>
              {apartmentInfo.surface} m²
            </Text>
          </>
        )}
      </View>

      <View style={styles.buttonsContainer}>
        <ActionButton
          style={styles.button}
          onTap={() => {
            if (allSwiped) {
              setAllSwiped(false);
            }
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
        <ActionButton style={styles.button} onTap={() => setAllSwiped(!allSwiped)}>
          <Ionicons name="chatbox-outline" size={ICON_SIZE - 10} color="black" />
        </ActionButton>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },

  swiperContainer: {
    // backgroundColor: 'red',
    flex: 6,
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
    // backgroundColor: 'green',
    flex: 1,
    paddingLeft: 20,
    justifyContent: 'center',
  },
  textTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  textSubtitle: {
    fontSize: 18,
  },

  buttonsContainer: {
    // backgroundColor: 'blue',
    flex: 1,
    paddingBottom: 5,
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

  // Reuse modal styles for the final screen
  endScreenContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 30,
  },
  modalText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  modalButton: {
    backgroundColor: '#4BA3C3',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 10,
    minWidth: 180,
    alignItems: 'center',
  },
  modalButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});
