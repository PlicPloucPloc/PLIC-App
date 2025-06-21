import React, { useState } from 'react';
import { Dimensions, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { ColorTheme } from '@app/Colors';
import { ApartmentResponse } from '@app/definitions';
import { useThemeColors } from '@app/hooks/UseThemeColor';
import { Images } from '@assets/index';
import { Ionicons } from '@expo/vector-icons';
import { SharedStackScreenProps } from '@navigation/Types';
import { Image } from 'expo-image';
import PagerView from 'react-native-pager-view';

function InfoItem({
  icon,
  label,
  value,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  value: string | number;
}) {
  const colors = useThemeColors();
  const styles = createStyles(colors);

  return (
    <View style={styles.criteriaItem}>
      <Ionicons name={icon} size={16} color="#555" />
      <Text style={styles.criteriaText}>
        <Text style={{ fontWeight: '600' }}>{label}: </Text>
        {value}
      </Text>
    </View>
  );
}

const Divider = () => <View style={{ height: 1, backgroundColor: '#ddd', marginVertical: 20 }} />;

export default function ApartmentDetailsScreen({
  navigation,
  route,
}: SharedStackScreenProps<'ApartmentDetails'>) {
  const colors = useThemeColors();
  const styles = createStyles(colors);

  const apartment = route.params.apartment ?? ({} as ApartmentResponse);
  const { title, description, images, criteria } = apartment.additional_info;
  const baseRent = 720;
  const fullRent = baseRent + criteria.monthlyCharges;

  const [showFullDescription, setShowFullDescription] = useState(false);
  const MAX_LINES = 4;

  const [currentPage, setCurrentPage] = useState(0);

  return (
    <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContainer}>
      <View style={styles.pagerWrapper}>
        <PagerView
          style={styles.pagerView}
          initialPage={0}
          onPageSelected={(e) => setCurrentPage(e.nativeEvent.position)}>
          {images.urls.map((uri, index) => (
            <Pressable
              key={index}
              style={styles.imageContainer}
              onPress={() => navigation.navigate('ImageList', { images: images.urls })}>
              <Image contentFit="cover" source={uri} style={styles.image} />
            </Pressable>
          ))}
        </PagerView>

        <View style={styles.imageCounter}>
          <Text style={styles.imageCounterText}>
            {currentPage + 1} / {images.urls.length}
          </Text>
        </View>
      </View>

      <View style={styles.infoContainer}>
        <Text style={styles.title}>{title}</Text>

        <Text style={styles.priceText}>
          {baseRent} € <Text style={styles.lightText}>no charges</Text>
        </Text>
        <Text style={styles.priceText}>
          {fullRent} € <Text style={styles.lightText}>with charges</Text>
        </Text>

        <View style={styles.criteriaContainerGrid}>
          <View style={styles.criteriaColumn}>
            <InfoItem icon="resize" label="Surface" value={`${criteria.surface} m²`} />
            <InfoItem icon="apps" label="Rooms" value={criteria.numberOfRooms} />
            <InfoItem icon="bed-outline" label="Bedrooms" value={criteria.numberOfBedRoom} />
            <InfoItem
              icon="cube-outline"
              label="Furnished"
              value={criteria.isFurnished ? 'Yes' : 'No'}
            />
          </View>
          <View style={styles.criteriaColumn}>
            <InfoItem icon="flame-outline" label="Heating" value={criteria.heating_type} />
            <InfoItem icon="layers-outline" label="Floor" value={criteria.floor} />
            <InfoItem
              icon="swap-vertical-outline"
              label="Elevator"
              value={criteria.elevator ? 'Yes' : 'No'}
            />
            <InfoItem icon="calendar-outline" label="Available" value={criteria.availableFrom} />
          </View>
        </View>

        <Divider />

        <Text style={styles.sectionTitle}>Description</Text>
        <Text
          style={styles.description}
          numberOfLines={showFullDescription ? undefined : MAX_LINES}
          ellipsizeMode="tail">
          {description}
        </Text>
        {description.length > 100 && (
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
  });
