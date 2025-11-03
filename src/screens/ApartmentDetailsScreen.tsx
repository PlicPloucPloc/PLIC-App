import React, { useCallback, useEffect, useState } from 'react';
import { Dimensions, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { SwipeDirection } from '@ellmos/rn-swiper-list';
import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import PagerView from 'react-native-pager-view';

import { ColorTheme } from '@app/Colors';
import { ApartmentInfo } from '@app/definitions';
import { useThemeColors } from '@app/hooks/UseThemeColor';
import { setSwipeDirection } from '@app/redux/slices';
import store from '@app/redux/Store';
import { getApartmentInfoById } from '@app/rest/ApartmentService';
import { getApartmentImages } from '@app/rest/S3Service';
import SwipeButton from '@components/ActionButton';
import ApartmentDetailsAmenities from '@components/ApartmentDetailsAmenities';
import NearbyInfrastructureMap from '@components/ApartmentDetailsMap';
import Loader from '@components/Loader';
import { SharedStackScreenProps } from '@navigation/Types';

const ICON_SIZE = 38;

export default function ApartmentDetailsScreen({
  navigation,
  route,
}: SharedStackScreenProps<'ApartmentDetails'>) {
  const colors = useThemeColors();
  const styles = createStyles(colors);

  const [loading, setLoading] = useState(true);
  const [apartment, setApartment] = useState<ApartmentInfo>();

  const [showFullDescription, setShowFullDescription] = useState(false);
  const MAX_LINES = 4;

  const [currentPage, setCurrentPage] = useState(0);

  useEffect(() => {
    (async () => {
      setLoading(true);

      let apartmentTmp: ApartmentInfo;
      if (route.params?.apartment) {
        apartmentTmp = { ...route.params.apartment };
      } else if (route.params?.apartmentId) {
        const apartmentResponse = await getApartmentInfoById(route.params.apartmentId);
        if (!apartmentResponse) return;

        apartmentTmp = apartmentResponse;
      } else {
        console.warn('No apartment data provided in route params');
        return;
      }

      apartmentTmp.images = await getApartmentImages(apartmentTmp);
      setApartment(apartmentTmp);
      setLoading(false);
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

        <Text style={styles.priceText}>
          {apartment.rent} € <Text style={styles.lightText}>without charges</Text>
        </Text>

        {apartment.estimated_price && (
          <Text style={styles.priceText}>
            {apartment.estimated_price} € <Text style={styles.lightText}>with charges</Text>
          </Text>
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
            <SwipeButton style={styles.button} onPress={navigation.goBack}>
              <Ionicons name="arrow-back" size={ICON_SIZE - 10} color={colors.contrast} />
            </SwipeButton>
            <SwipeButton
              style={styles.button}
              onPress={() => {
                store.dispatch(setSwipeDirection(SwipeDirection.LEFT));
                navigation.goBack();
              }}>
              <Ionicons name="close" size={ICON_SIZE} color="red" />
            </SwipeButton>
            <SwipeButton
              style={styles.button}
              onPress={() => {
                store.dispatch(setSwipeDirection(SwipeDirection.RIGHT));
                navigation.goBack();
              }}>
              <Ionicons name="heart" size={ICON_SIZE} color={colors.primary} />
            </SwipeButton>
            <SwipeButton
              style={styles.button}
              onPress={() =>
                navigation.navigate('BottomTabStack', {
                  screen: 'MessageStack',
                  params: {
                    screen: 'DirectMessage',
                  },
                })
              }>
              <Ionicons name="chatbox-outline" size={ICON_SIZE - 10} color={colors.contrast} />
            </SwipeButton>
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
      width: width - 10,
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
      backgroundColor: '#eee',
      marginTop: 8,
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
