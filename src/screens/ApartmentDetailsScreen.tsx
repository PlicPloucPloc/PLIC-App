import React from 'react';
import { Dimensions, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { ApartmentResponse } from '@app/definitions';
import { SharedStackScreenProps } from '@navigation/Types';
import { Image } from 'expo-image';
import PagerView from 'react-native-pager-view';

export default function ApartmentDetailsScreen({
  navigation,
  route,
}: SharedStackScreenProps<'ApartmentDetails'>) {
  const apartment = route.params.apartment ?? ({} as ApartmentResponse);
  const { title, description, images, criteria } = apartment.additional_info;
  const baseRent = 720;
  const fullRent = baseRent + criteria.monthlyCharges;

  return (
    <ScrollView contentContainerStyle={styles.scrollContent}>
      <PagerView style={styles.pagerView} initialPage={0}>
        {images.urls.map((uri, index) => (
          <Pressable
            key={index}
            style={styles.imageContainer}
            onPress={() => navigation.navigate('ImageList', { images: images.urls })}>
            <Image key={index} contentFit="cover" source={uri} style={styles.image} />
          </Pressable>
        ))}
      </PagerView>

      <View style={{ paddingHorizontal: 16, marginTop: 12 }}>
        <Text style={styles.title}>{title}</Text>

        <Text style={styles.priceText}>
          {baseRent} € <Text style={styles.lightText}>no charges</Text>
        </Text>
        <Text style={styles.priceText}>
          {fullRent} € <Text style={styles.lightText}>with charges</Text>
        </Text>

        <Text style={styles.sectionTitle}>Description</Text>
        <Text style={styles.description}>{description}</Text>

        <Text style={styles.sectionTitle}>Filtres et infos de l'appart</Text>
        <View style={styles.criteriaContainer}>
          <Text>Surface: {criteria.surface} m²</Text>
          <Text>Rooms: {criteria.numberOfRooms}</Text>
          <Text>Bedrooms: {criteria.numberOfBedRoom}</Text>
          <Text>Furnished: {criteria.isFurnished ? 'Yes' : 'No'}</Text>
          <Text>Heating: {criteria.heating_type}</Text>
          <Text>Floor: {criteria.floor}</Text>
          <Text>Elevator: {criteria.elevator ? 'Yes' : 'No'}</Text>
          <Text>Available from: {criteria.availableFrom}</Text>
        </View>

        <Text style={styles.sectionTitle}>Liste des trucs à proximité et map ?</Text>
      </View>
    </ScrollView>
  );
}

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  scrollContent: {
    paddingBottom: 24,
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

  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  priceText: {
    fontSize: 18,
    marginTop: 8,
  },
  lightText: {
    color: '#888',
    fontSize: 14,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginTop: 20,
    marginBottom: 6,
  },
  description: {
    fontSize: 14,
    color: '#333',
  },
  criteriaContainer: {
    backgroundColor: '#f4f4f4',
    padding: 12,
    borderRadius: 8,
    marginTop: 8,
  },
});
