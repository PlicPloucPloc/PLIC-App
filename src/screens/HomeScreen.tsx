import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Alert, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { ColorTheme } from '@app/Colors';
import { ApartmentInfo } from '@app/definitions';
import { RELATION_TYPE } from '@app/definitions/rest/RelationService';
import { usePaginatedQuery } from '@app/hooks/UsePaginatedQuery';
import { useThemeColors } from '@app/hooks/UseThemeColor';
import { getApartmentsNoRelationPaginated } from '@app/rest/ApartmentService';
import { deleteRelation, postRelation } from '@app/rest/RelationService';
import SwipeButton from '@components/ActionButton';
import Loader from '@components/Loader';
import { Swiper, type SwiperCardRefType } from '@ellmos/rn-swiper-list';
import { Ionicons } from '@expo/vector-icons';
import { HomeStackScreenProps } from '@navigation/Types';
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';

const ICON_SIZE = 38;
const SWIPE_DELAY = 300;

export default function HomeScreen({ navigation }: HomeStackScreenProps<'Home'>) {
  const colors = useThemeColors();
  const styles = createStyles(colors);

  const swiperRef = useRef<SwiperCardRefType>();

  const [isContactingApi, setIsContactingApi] = useState(false);
  const [allSwiped, setAllSwiped] = useState(false);
  const [apartmentInfo, setApartmentInfo] = useState<{
    title?: string;
    surface?: number;
    location?: string;
    rent?: number;
  }>({});

  const fetchApartments = useCallback(
    (offset: number) => getApartmentsNoRelationPaginated(offset),
    [],
  );

  const {
    data: apartments,
    refreshing,
    fetchMore,
  } = usePaginatedQuery<ApartmentInfo>(fetchApartments);

  const onIndexChange = useCallback(
    (index: number) => {
      if (index >= apartments.length) {
        return;
      }

      const PREFETCH_OFFSET = 3; // Number of remaining cards before fetching more data
      if (index >= apartments.length - PREFETCH_OFFSET) {
        fetchMore(PREFETCH_OFFSET);
      }

      const apartment = apartments[index];
      setApartmentInfo({
        title: apartment.name,
        surface: apartment.surface,
        location: apartment.location,
        rent: apartment.rent,
      });
    },
    [apartments, fetchMore],
  );

  async function handlePostRelation(apartmentId: number, type: RELATION_TYPE) {
    setIsContactingApi(true);

    const hasPostedSuccesfully = await postRelation(apartmentId, type);
    if (!hasPostedSuccesfully) {
      Alert.alert(
        'Error',

        `An error occurred while ${type == RELATION_TYPE.LIKE ? 'Liking' : 'Disliking'} the apartment.`,
      );
      return;
    }
    setIsContactingApi(false);
  }

  async function handleDeleteRelation(apartmentId: number) {
    setIsContactingApi(true);
    await deleteRelation(apartmentId);
    setIsContactingApi(false);
  }

  if (refreshing) {
    return <Loader loading={true} />;
  }

  return (
    <View style={styles.container}>
      <Loader loading={isContactingApi} invisible={true} />
      <View style={styles.swiperContainer}>
        {/* End screen */}
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

        {/* Swiper */}
        <View style={[styles.touchableContainer, allSwiped ? { width: '0%', height: '0%' } : {}]}>
          <Swiper
            ref={swiperRef}
            cardStyle={styles.cardStyle}
            data={apartments}
            prerenderItems={5}
            disableBottomSwipe={true}
            disableTopSwipe={true}
            onIndexChange={onIndexChange}
            onSwipedAll={() => {
              setTimeout(() => {
                setApartmentInfo({});
                setAllSwiped(true);
              }, SWIPE_DELAY);
            }}
            onSwipeRight={() => {
              handlePostRelation(
                apartments[swiperRef.current?.activeIndex || 0].apartment_id,
                RELATION_TYPE.LIKE,
              );
            }}
            onSwipeLeft={() => {
              handlePostRelation(
                apartments[swiperRef.current?.activeIndex || 0].apartment_id,
                RELATION_TYPE.DISLIKE,
              );
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
          disabled={swiperRef.current && swiperRef.current?.activeIndex <= 0}
          style={styles.button}
          onPress={() => {
            if (isContactingApi) return;
            if (allSwiped) {
              setAllSwiped(false);
            }
            handleDeleteRelation(
              apartments[(swiperRef.current?.activeIndex || 1) - 1].apartment_id,
            );

            swiperRef.current?.swipeBack();
          }}>
          <Ionicons name="arrow-undo" size={ICON_SIZE - 10} color={colors.contrast} />
        </SwipeButton>
        <SwipeButton
          disabled={allSwiped}
          style={styles.button}
          onPress={() => {
            if (isContactingApi) return;
            swiperRef.current?.swipeLeft();
          }}>
          <Ionicons name="close" size={ICON_SIZE} color="red" />
        </SwipeButton>
        <SwipeButton
          style={styles.button}
          disabled={allSwiped}
          onPress={() => {
            if (isContactingApi) return;
            swiperRef.current?.swipeRight();
          }}>
          <Ionicons name="heart" size={ICON_SIZE} color={colors.primary} />
        </SwipeButton>
        <SwipeButton
          style={styles.button}
          disabled={allSwiped}
          onPress={() => {
            if (isContactingApi) return;
            Alert.alert('Chat not implemented yet');
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
      backgroundColor: colors.primary,
      paddingHorizontal: 20,
      paddingVertical: 10,
      borderRadius: 10,
      minWidth: 180,
      alignItems: 'center',
    },
    modalButtonText: {
      color: colors.contrast,
      fontSize: 16,
      fontWeight: '600',
    },
  });
