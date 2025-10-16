import React, { useEffect, useState } from 'react';
import { Dimensions, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { ColorTheme } from '@app/Colors';
import { ApartmentInfo } from '@app/definitions';
import { useThemeColors } from '@app/hooks/UseThemeColor';
import { setSwipeDirection } from '@app/redux/slices';
import store from '@app/redux/Store';
import { getApartmentInfoById } from '@app/rest/ApartmentService';
import { getApartmentImages } from '@app/rest/S3Service';
import { Images } from '@assets/index';
import SwipeButton from '@components/ActionButton';
import Loader from '@components/Loader';
import { SwipeDirection } from '@ellmos/rn-swiper-list';
import { Ionicons } from '@expo/vector-icons';
import { SharedStackScreenProps } from '@navigation/Types';
import { Image } from 'expo-image';
import PagerView from 'react-native-pager-view';

const ICON_SIZE = 38;

const Divider = () => <View style={{ height: 1, backgroundColor: '#ddd', marginVertical: 20 }} />;

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
        console.log('Using apartment from route params', route.params.apartment);
        apartmentTmp = { ...route.params.apartment };
      } else if (route.params?.apartmentId) {
        console.log('Fetching apartment by ID from route params', route.params.apartmentId);
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

  const InfoItem = ({
    icon,
    label,
    value,
  }: {
    icon: keyof typeof Ionicons.glyphMap;
    label: string;
    value: string | number | null;
  }) => {
    if (value === null || value === undefined) return null;

    return (
      <View style={styles.criteriaItem}>
        <Ionicons name={icon} size={16} color="#555" />
        <Text style={styles.criteriaText}>
          <Text style={{ fontWeight: '600' }}>{label}: </Text>
          {value}
        </Text>
      </View>
    );
  };

  if (loading || !apartment) {
    return <Loader loading={true} />;
  }

  return (
    <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContainer}>
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
        <Text style={styles.title}>{apartment.name}</Text>

        <Text style={styles.priceText}>
          {apartment.rent} € <Text style={styles.lightText}>no charges</Text>
        </Text>
        <Text style={styles.priceText}>
          {apartment.rent + 0} € <Text style={styles.lightText}>with charges</Text>{' '}
          {/* TODO: change charges */}
        </Text>

        <View style={styles.criteriaContainerGrid}>
          <View style={styles.criteriaColumn}>
            <InfoItem icon="resize" label="Surface" value={`${apartment.surface} m²`} />
            <InfoItem icon="apps" label="Rooms" value={apartment.number_of_rooms} />
            <InfoItem icon="bed-outline" label="Bedrooms" value={apartment.number_of_bedrooms} />
            <InfoItem
              icon="cube-outline"
              label="Furnished"
              value={apartment.is_furnished ? 'Yes' : 'No'}
            />
          </View>
          <View style={styles.criteriaColumn}>
            <InfoItem icon="layers-outline" label="Floor" value={apartment.floor} />
            <InfoItem
              icon="swap-vertical-outline"
              label="Elevator"
              value={apartment.has_elevator ? 'Yes' : 'No'}
            />
            <InfoItem
              icon="calendar-outline"
              label="Available"
              value={apartment.available_from?.toString() ?? null}
            />
          </View>
        </View>

        <Divider />

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

        <Text style={styles.sectionTitle}>Map</Text>
        <Image
          source={Images.maps}
          style={{ width: '100%', height: 200, borderRadius: 12 }}
          contentFit="cover"
        />
      </View>

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

    criteriaContainerGrid: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      padding: 4,
      marginTop: 12,
    },
    criteriaColumn: {
      flex: 1,
      gap: 12,
    },
    criteriaItem: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
    },
    criteriaText: {
      fontSize: 14,
      color: '#333',
      flexShrink: 1,
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
