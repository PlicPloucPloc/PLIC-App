import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Alert, Image, StyleSheet, Text, TouchableWithoutFeedback, View } from 'react-native';

import { SwipeDirection, Swiper, type SwiperCardRefType } from '@ellmos/rn-swiper-list';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import { useSelector } from 'react-redux';

import { ColorTheme } from '@app/Colors';
import { ApartmentInfo, RELATION_TYPE } from '@app/definitions';
import { usePaginatedQuery } from '@app/hooks/UsePaginatedQuery';
import { useThemeColors } from '@app/hooks/UseThemeColor';
import { setSwipeDirection } from '@app/redux/slices';
import store, { RootState } from '@app/redux/Store';
import { getApartmentsNoRelationPaginated } from '@app/rest/ApartmentService';
import { deleteRelation, postRelation } from '@app/rest/RelationService';
import EverythingSwiped from '@components/EverythingSwiped';
import FiltersNotSet from '@components/FiltersNotSet';
import HeaderRefreshButton from '@components/HeaderRefreshButton';
import Loader from '@components/Loader';
import SwipeButton from '@components/SwipeButton';
import { HomeStackScreenProps } from '@navigation/Types';

const ICON_SIZE = 38;
const SWIPE_DELAY = 300;

export default function HomeScreen({ navigation }: HomeStackScreenProps<'Home'>) {
  const colors = useThemeColors();
  const styles = createStyles(colors);

  const filters = useSelector((state: RootState) => state.filtersState);

  const swiperRef = useRef<SwiperCardRefType>(null);
  const swipeDirection = useSelector((state: RootState) => state.appState.swipeDirection);

  // handle swipe from details screen
  useFocusEffect(
    useCallback(() => {
      if (swipeDirection) {
        store.dispatch(setSwipeDirection(undefined));

        setTimeout(() => {
          // Delay to wait for the screen to be visible
          if (swipeDirection === SwipeDirection.RIGHT) {
            swiperRef.current?.swipeRight();
          } else if (swipeDirection === SwipeDirection.LEFT) {
            swiperRef.current?.swipeLeft();
          }
        }, 100);
      }
    }, [swipeDirection]),
  );

  const [allSwiped, setAllSwiped] = useState(false);
  const [backButtonDisabled, setBackButtonDisabled] = useState(false);
  const [apartmentInfo, setApartmentInfo] = useState<{
    title?: string;
    surface?: number;
    location?: string;
    rent?: number;
    apartment_id?: number;
  }>({});

  const fetchApartments = useCallback(
    (offset: number) => getApartmentsNoRelationPaginated(offset, filters),
    [filters],
  );

  const duplicateResolver = useCallback((data: ApartmentInfo[]) => {
    const seen = new Set();

    // use this to filter the apartments to only include the ones in goodApts array
    const goodApts = [870, 880, 1231, 1264, 1300];

    const filtered = data.filter((item) => {
      const duplicate = seen.has(item.apartment_id);
      seen.add(item.apartment_id);
      return !duplicate && goodApts.includes(item.apartment_id);
    });

    //sort the filtered by the order in goodApts
    const res = filtered.sort((a, b) => {
      return goodApts.indexOf(a.apartment_id) - goodApts.indexOf(b.apartment_id);
    });

    return res;
  }, []);

  const {
    data: apartments,
    refreshing,
    fetchMore,
    refresh,
  } = usePaginatedQuery<ApartmentInfo>(fetchApartments, duplicateResolver);

  useEffect(() => {
    // handle reload of apartments
    setAllSwiped(swiperRef.current?.activeIndex === apartments.length);
  }, [apartments]);

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => <HeaderRefreshButton icon="refresh" onPress={refresh} />,
    });
  }, [navigation, refresh]);

  const onIndexChange = useCallback(
    (index: number) => {
      if (index >= apartments.length) {
        return;
      }

      if (index == 0) {
        setBackButtonDisabled(true);
      }

      const PREFETCH_OFFSET = 3; // Number of remaining cards before fetching more data
      if (index > apartments.length - PREFETCH_OFFSET) {
        fetchMore(PREFETCH_OFFSET);
      }

      const apartment = apartments[index];
      setApartmentInfo({
        title: apartment.name,
        surface: apartment.surface ?? 'Unknown',
        location: apartment.location,
        rent: apartment.rent,
        apartment_id: apartment.apartment_id,
      });
    },
    [apartments, fetchMore],
  );

  const onSwipedAll = useCallback(() => {
    if (refreshing) return;
    setTimeout(() => {
      setAllSwiped(true);
      setApartmentInfo({});
    }, SWIPE_DELAY);
  }, [refreshing]);

  async function handlePostRelation(apartmentId: number, type: RELATION_TYPE) {
    const hasPostedSuccesfully = await postRelation(apartmentId, type);
    if (!hasPostedSuccesfully) {
      Alert.alert(
        'Error',
        `An error occurred while ${type == RELATION_TYPE.LIKE ? 'Liking' : 'Disliking'} the apartment.`,
      );
    }
  }

  if (refreshing) {
    return <Loader loading={true} />;
  }

  if (!filters.hasValues) {
    return <FiltersNotSet navigation={navigation} />;
  }

  return (
    <View style={styles.container}>
      <View style={styles.swiperContainer}>
        {/* End screen */}
        {!refreshing && allSwiped && <EverythingSwiped navigation={navigation} />}

        {/* Swiper */}
        <View style={[styles.touchableContainer, allSwiped ? { width: '0%', height: '0%' } : {}]}>
          <Swiper
            ref={swiperRef}
            cardStyle={styles.cardStyle}
            data={apartments}
            prerenderItems={5}
            swipeVelocityThreshold={1200}
            disableBottomSwipe={true}
            disableTopSwipe={true}
            onIndexChange={onIndexChange}
            onSwipedAll={onSwipedAll}
            onSwipeRight={() => {
              handlePostRelation(
                apartments[swiperRef.current?.activeIndex || 0].apartment_id,
                RELATION_TYPE.LIKE,
              );
              setBackButtonDisabled(false);
            }}
            onSwipeLeft={() => {
              handlePostRelation(
                apartments[swiperRef.current?.activeIndex || 0].apartment_id,
                RELATION_TYPE.DISLIKE,
              );
              setBackButtonDisabled(false);
            }}
            renderCard={(apartment: ApartmentInfo) => (
              <TouchableWithoutFeedback
                onPress={() => {
                  navigation.navigate('SharedStack', {
                    animation: 'slide_from_bottom',
                    screen: 'ApartmentDetails',
                    params: {
                      apartment: apartments[swiperRef.current?.activeIndex || 0],
                      enableRelationButtons: true,
                    },
                  });
                }}>
                <Image
                  source={{ uri: apartment.image_thumbnail }}
                  style={styles.renderCardImage}
                  resizeMode="cover"
                />
              </TouchableWithoutFeedback>
            )}
            OverlayLabelRight={() => (
              <View style={[styles.overlayLabelContainer, { backgroundColor: colors.secondary }]}>
                <Ionicons name="heart" size={150} color={colors.primary} />
              </View>
            )}
            OverlayLabelLeft={() => (
              <View style={[styles.overlayLabelContainer, { backgroundColor: '#761717' }]}>
                <Ionicons name="close" size={150} color={'#FF0000'} />
              </View>
            )}
          />
        </View>
      </View>

      {/* Apartment Info */}
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
              {apartmentInfo.surface} m² /{' '}
              {apartmentInfo.rent && apartmentInfo.rent <= 10
                ? 'Price to negotiate'
                : `${apartmentInfo.rent} €`}
            </Text>
          </>
        )}
      </View>

      {/* Buttons */}
      <View style={styles.buttonsContainer}>
        <SwipeButton
          icon={{
            name: 'arrow-undo',
            size: ICON_SIZE - 15,
            color: colors.contrast,
          }}
          disabled={backButtonDisabled || apartments.length === 0}
          onPress={() => {
            const currentIndex = swiperRef.current?.activeIndex || 0;
            if (currentIndex <= 0) return;

            deleteRelation(apartments[currentIndex - 1].apartment_id);

            swiperRef.current?.swipeBack();
            setAllSwiped(false);
            setBackButtonDisabled(true);
          }}
        />
        <SwipeButton
          icon={{ name: 'close', size: ICON_SIZE, color: 'red' }}
          disabled={allSwiped}
          onPress={() => swiperRef.current?.swipeLeft()}
        />
        <SwipeButton
          icon={{ name: 'heart', size: ICON_SIZE, color: colors.primary }}
          disabled={allSwiped}
          onPress={() => swiperRef.current?.swipeRight()}
        />

        {/* disabled button */}
        <SwipeButton
          icon={{ name: 'chatbox-outline', size: ICON_SIZE - 15, color: colors.contrast }}
          hidden={true}
        />
      </View>
    </View>
  );
}

const createStyles = (colors: ColorTheme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },

    swiperContainer: {
      flex: 6,
      width: '100%',
      height: '100%',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 1,
    },
    touchableContainer: {
      width: '95%',
      height: '98%',
      justifyContent: 'center',
      alignItems: 'center',
    },
    cardStyle: {
      width: '100%',
      height: '100%',
    },
    renderCardImage: {
      height: '100%',
      width: '100%',
      borderRadius: 15,
    },
    overlayLabelContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      borderRadius: 15,
      opacity: 0.8,
    },

    textContainer: {
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
      flex: 1,
      paddingBottom: 5,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-evenly',
    },
  });
