import React, { useCallback, useEffect, useState } from 'react';
import { Alert, Dimensions, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { SwipeDirection } from '@ellmos/rn-swiper-list';
import { Image } from 'expo-image';
import PagerView from 'react-native-pager-view';
import { useSelector } from 'react-redux';

import { ColorTheme } from '@app/Colors';
import { ApartmentInfo } from '@app/definitions';
import { CreateRoomRequest } from '@app/definitions/rest/ChatService';
import { useThemeColors } from '@app/hooks/UseThemeColor';
import { setSwipeDirection } from '@app/redux/slices';
import store, { RootState } from '@app/redux/Store';
import { createAndGetRoom } from '@app/rest/ChatService';
import { getApartmentImages } from '@app/rest/S3Service';
import ApartmentDetailsAmenities from '@components/ApartmentDetailsAmenities';
import NearbyInfrastructureMap from '@components/ApartmentDetailsMap';
import HeaderSendMessageButton from '@components/HeaderSendMessageButton';
import Loader from '@components/Loader';
import SwipeButton from '@components/SwipeButton';
import { SharedStackScreenProps } from '@navigation/Types';

const ICON_SIZE = 38;
const MAX_LINES = 4;

export default function ApartmentDetailsScreen({
  navigation,
  route,
}: SharedStackScreenProps<'ApartmentDetails'>) {
  const colors = useThemeColors();
  const styles = createStyles(colors);

  const authState = useSelector((state: RootState) => state.authState);

  const [loading, setLoading] = useState(true);
  const [apartment, setApartment] = useState<ApartmentInfo>();

  const [showFullDescription, setShowFullDescription] = useState(false);

  const [currentPage, setCurrentPage] = useState(0);

  const sendMessage = useCallback(
    async (apartmentId: number, aptOwner: string) => {
      if (aptOwner === authState.userId) {
        Alert.alert(
          'Could not create chat !',
          'This apartment belongs to you, we cannot create a chat room.',
        );
      }

      const roomRequest: CreateRoomRequest = {
        apartment_id: apartmentId,
        users: [authState.userId, aptOwner],
      };

      const room = await createAndGetRoom(authState.userId, roomRequest);
      if (!room) {
        Alert.alert('Error', 'An error occurred while creating the chat room.');
        return;
      }

      navigation.navigate('SharedStack', {
        screen: 'Message',
        params: { roomInfo: room },
      });
    },
    [authState.userId, navigation],
  );

  useEffect(() => {
    if (!apartment) {
      return;
    }

    navigation.setOptions({
      headerRight: () => (
        <HeaderSendMessageButton
          icon="chatbox-ellipses-outline"
          onPress={() => sendMessage(apartment?.apartment_id, apartment?.owner_id)}
        />
      ),
    });
  }, [navigation, apartment, sendMessage]);

  useEffect(() => {
    (async () => {
      setLoading(true);

      const apartmentTmp: ApartmentInfo = route.params.apartment;
      const images = await getApartmentImages(apartmentTmp).finally(() => {
        setLoading(false);
      });

      setApartment({
        ...apartmentTmp,
        images,
      });
    })();
  }, [route.params]);

  const Divider = useCallback(
    () => <View style={{ height: 1, backgroundColor: '#ddd', marginVertical: 20 }} />,
    [],
  );

  if (loading || !apartment) {
    return <Loader loading={true} />;
  }

  return (
    <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContainer}>
      {/* ============= Pictures ============= */}
      <View style={styles.pagerWrapper}>
        <PagerView
          style={styles.pagerView}
          initialPage={0}
          onPageSelected={(e) => setCurrentPage(e.nativeEvent.position)}>
          {apartment.images.map((uri, index) => (
            <Pressable
              key={index}
              style={styles.imageContainer}
              onPress={() => {
                navigation.navigate('ImageList', { images: apartment.images });
              }}>
              <Image contentFit="cover" source={uri} style={styles.image} />
            </Pressable>
          ))}
        </PagerView>

        <View style={styles.imageCounter}>
          <Text style={styles.imageCounterText}>
            {currentPage + 1} / {apartment.images.length}
          </Text>
        </View>
      </View>

      <View style={styles.infoContainer}>
        {/* ============= Header ============= */}
        <Text style={styles.title}>{apartment.name}</Text>

        {apartment.rent && apartment.rent <= 10 ? (
          <Text style={styles.lightText}>Price to negotiate</Text>
        ) : (
          <>
            <Text style={styles.priceText}>
              {apartment.rent} € <Text style={styles.lightText}>without charges</Text>
            </Text>

            {apartment.estimated_price && (
              <Text style={styles.priceText}>
                {apartment.estimated_price} € <Text style={styles.lightText}>with charges</Text>
              </Text>
            )}
          </>
        )}

        <Divider />

        {/* ============= Description ============= */}
        <Text style={styles.sectionTitle}>Description</Text>
        <Text
          style={styles.description}
          numberOfLines={showFullDescription ? undefined : MAX_LINES}
          ellipsizeMode="tail">
          {apartment.description}
        </Text>
        {apartment.description.length > 100 && (
          <Pressable onPress={() => setShowFullDescription(!showFullDescription)}>
            <Text style={{ color: '#007bff', marginTop: 4 }}>
              {showFullDescription ? 'Read less' : 'Read more'}
            </Text>
          </Pressable>
        )}

        <Divider />

        {/* ============= Amenities ============= */}
        <Text style={styles.sectionTitle}>Amenities</Text>

        <ApartmentDetailsAmenities apartment={apartment} />

        <Divider />

        {/* ============= Map ============= */}
        <Text style={styles.sectionTitle}>Map</Text>

        <View style={styles.mapContainer}>
          <NearbyInfrastructureMap
            address={apartment.location}
            style={{ width: '100%', height: '100%' }}
          />
        </View>
      </View>

      {/* ============= Relation buttons ============= */}
      {route.params.enableRelationButtons && (
        <>
          <Divider />

          <View style={styles.buttonsContainer}>
            <SwipeButton
              icon={{ name: 'arrow-back', size: ICON_SIZE - 15, color: colors.contrast }}
              onPress={navigation.goBack}
            />

            <SwipeButton
              icon={{ name: 'close', size: ICON_SIZE, color: 'red' }}
              onPress={() => {
                store.dispatch(setSwipeDirection(SwipeDirection.LEFT));
                navigation.goBack();
              }}
            />

            <SwipeButton
              icon={{ name: 'heart', size: ICON_SIZE, color: colors.primary }}
              onPress={() => {
                store.dispatch(setSwipeDirection(SwipeDirection.RIGHT));
                navigation.goBack();
              }}
            />

            {/* disabled button */}
            <SwipeButton
              icon={{ name: 'chatbox-outline', size: ICON_SIZE - 15, color: colors.contrast }}
              hidden={true}
            />
          </View>
        </>
      )}
    </ScrollView>
  );
}

const { width } = Dimensions.get('window');

const createStyles = (colors: ColorTheme) =>
  StyleSheet.create({
    scrollContainer: {
      paddingBottom: 24,
      backgroundColor: colors.background,
    },

    pagerWrapper: {
      position: 'relative',
      height: 250,
      width: '100%',
      borderRadius: 12,
      overflow: 'hidden',
    },
    pagerView: {
      height: 250,
      width: '100%',
      borderRadius: 12,
      overflow: 'hidden',
    },
    imageContainer: {
      flex: 1,
      alignItems: 'center',
    },
    image: {
      width: width - 8,
      height: '100%',
      borderRadius: 12,
    },

    imageCounter: {
      position: 'absolute',
      bottom: 10,
      right: 14,
      backgroundColor: 'rgba(0,0,0,0.5)',
      borderRadius: 12,
      paddingHorizontal: 8,
      paddingVertical: 2,
      zIndex: 10,
    },
    imageCounterText: {
      color: colors.textContrast,
      fontSize: 12,
      fontWeight: '600',
    },

    infoContainer: {
      paddingHorizontal: 16,
      marginTop: 12,
    },
    title: {
      fontSize: 22,
      fontWeight: 'bold',
      marginBottom: 12,
    },
    priceText: {
      fontWeight: '600',
      fontSize: 18,
      marginTop: 8,
    },
    lightText: {
      color: colors.textSecondary,
      fontSize: 14,
    },

    sectionTitle: {
      fontSize: 18,
      fontWeight: '600',
      marginBottom: 6,
    },
    description: {
      fontSize: 14,
      color: colors.textPrimary,
    },

    mapContainer: {
      width: '100%',
      height: 400,
      borderRadius: 12,
      overflow: 'hidden',
      marginTop: 8,
    },

    buttonsContainer: {
      flex: 1,
      paddingBottom: 5,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-evenly',
    },
  });
