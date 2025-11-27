import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Alert, Image, StyleSheet, Text, TouchableWithoutFeedback, View } from 'react-native';

import { SwipeDirection, Swiper, type SwiperCardRefType } from '@ellmos/rn-swiper-list';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import { useSelector } from 'react-redux';

import { ColorTheme } from '@app/Colors';
import { ApartmentInfo, RELATION_TYPE } from '@app/definitions';
import { CreateRoomRequest } from '@app/definitions/rest/ChatService';
import { usePaginatedQuery } from '@app/hooks/UsePaginatedQuery';
import { useThemeColors } from '@app/hooks/UseThemeColor';
import { setSwipeDirection } from '@app/redux/slices';
import store, { RootState } from '@app/redux/Store';
import { getApartmentsNoRelationPaginated } from '@app/rest/ApartmentService';
import { createRoom, getRoomDetails } from '@app/rest/ChatService';
import { deleteRelation, postRelation } from '@app/rest/RelationService';
import SwipeButton from '@components/ActionButton';
import EverythingSwiped from '@components/EverythingSwiped';
import FiltersNotSet from '@components/FiltersNotSet';
import HeaderRefreshButton from '@components/HeaderRefreshButton';
import Loader from '@components/Loader';
import { HomeStackScreenProps } from '@navigation/Types';

const ICON_SIZE = 38;
const SWIPE_DELAY = 300;

export default function HomeScreen({ navigation }: HomeStackScreenProps<'Home'>) {
  const colors = useThemeColors();
  const styles = createStyles(colors);

  const filters = useSelector((state: RootState) => state.filtersState);
  const authState = useSelector((state: RootState) => state.authState);

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
    return data.filter((item) => {
      const duplicate = seen.has(item.apartment_id);
      seen.add(item.apartment_id);
      return !duplicate;
    });
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

  async function createChat(apartmentId: number, aptOwner: string) {
    if (aptOwner === authState.userId) {
      Alert.alert(
        'Could not create chat !',
        'This apartment belongs to you, we cannot create a chat room.',
      );
    }

    const roomRequest: CreateRoomRequest = {
      apartment_id: apartmentId,
      owner_id: authState.userId,
      users: [aptOwner],
    };

    const roomId = await createRoom(roomRequest);
    if (!roomId) {
      return Alert.alert('Error', 'An error occurred while creating the chat room.');
    }

    const roomDetails = await getRoomDetails(authState.userId, roomId);
    if (!roomDetails) {
      return Alert.alert('Error', 'An error occurred while fetching the chat room details.');
    }

    const roomInfo = {
      room_id: roomDetails.room_id,
      participants_id: roomDetails.participants_id,
      last_message:
        roomDetails.messages.length > 0
          ? roomDetails.messages[roomDetails.messages.length - 1]
          : null,
      is_owner: roomDetails.owner_id === authState.userId,
      created_at: roomDetails.created_at,
      participants: roomDetails.participants,
    };

    navigation.navigate('SharedStack', {
      screen: 'DirectMessage',
      params: { roomInfo },
    });
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
              {apartmentInfo.surface} m² / {apartmentInfo.rent} €
            </Text>
          </>
        )}
      </View>

      {/* Buttons */}
      <View style={styles.buttonsContainer}>
        <SwipeButton
          disabled={backButtonDisabled || apartments.length === 0}
          style={styles.button}
          onPress={() => {
            const currentIndex = swiperRef.current?.activeIndex || 0;
            if (currentIndex <= 0) return;

            deleteRelation(apartments[currentIndex - 1].apartment_id);

            swiperRef.current?.swipeBack();
            setBackButtonDisabled(true);
          }}>
          <Ionicons name="arrow-undo" size={ICON_SIZE - 10} color={colors.contrast} />
        </SwipeButton>
        <SwipeButton
          disabled={allSwiped}
          style={styles.button}
          onPress={() => swiperRef.current?.swipeLeft()}>
          <Ionicons name="close" size={ICON_SIZE} color="red" />
        </SwipeButton>
        <SwipeButton
          style={styles.button}
          disabled={allSwiped}
          onPress={() => swiperRef.current?.swipeRight()}>
          <Ionicons name="heart" size={ICON_SIZE} color={colors.primary} />
        </SwipeButton>
        <SwipeButton
          style={styles.button}
          disabled={allSwiped}
          onPress={() => {
            const currentIndex = swiperRef.current?.activeIndex || 0;
            createChat(apartments[currentIndex].apartment_id, apartments[currentIndex].owner_id);
          }}>
          <Ionicons name="chatbox-outline" size={ICON_SIZE - 10} color={colors.contrast} />
        </SwipeButton>
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
    button: {
      padding: 10,
      borderRadius: 40,
      aspectRatio: 1,
      backgroundColor: colors.background,
      elevation: 4,
      justifyContent: 'center',
      alignItems: 'center',
      shadowColor: 'black',
    },
  });
