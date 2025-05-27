import React from 'react';
import { FlatList, Image, ScrollView, StyleSheet, Text, View } from 'react-native';

import { Apartment } from '@app/definitions';
import { SharedStackScreenProps } from '@navigation/Types';

export default function ApartmentDetailsScreen({
  navigation,
  route,
}: SharedStackScreenProps<'ApartmentDetails'>) {
  const apartment = route.params.apartment ?? ({} as Apartment);
  const { title, description, images, criteria } = apartment.additional_info;
  const baseRent = 720;
  const fullRent = baseRent + apartment.additional_info.criteria.monthlyCharges;

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>{title}</Text>

      {/* Image Carousel */}
      <FlatList
        data={images.urls}
        horizontal
        showsHorizontalScrollIndicator={false}
        pagingEnabled
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <Image source={{ uri: item }} style={styles.image} resizeMode="cover" />
        )}
      />

      {/* Price Info */}
      <Text style={styles.priceText}>
        {baseRent} € <Text style={styles.lightText}>no charges</Text>
      </Text>
      <Text style={styles.priceText}>
        {fullRent} € <Text style={styles.lightText}>with charges</Text>
      </Text>

      {/* Description */}
      <Text style={styles.sectionTitle}>Description</Text>
      <Text style={styles.description}>{description}</Text>

      {/* Criteria */}
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

      {/* Placeholder for map */}
      <Text style={styles.sectionTitle}>Liste des trucs à proximité et map ?</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  image: {
    width: 32,
    height: 200,
    borderRadius: 12,
    marginRight: 10,
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
