import React, { useCallback, useMemo, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { Ionicons } from '@expo/vector-icons';

import { ColorTheme } from '@app/Colors';
import { ApartmentInfo, IoniconName } from '@app/definitions';
import { useThemeColors } from '@app/hooks/UseThemeColor';

type InfoItemProps = {
  icon: IoniconName;
  label: string;
  value: string | number | null;
};

type AmenitiesProps = {
  apartment: ApartmentInfo;
};

export default function ApartmentDetailsAmenities({ apartment }: AmenitiesProps) {
  const colors = useThemeColors();
  const styles = createStyles(colors);

  const [showAllAmenities, setShowAllAmenities] = useState(false);

  const InfoItem = useCallback(
    ({ icon, label, value }: InfoItemProps) => {
      if (value === null || value === undefined) return null;

      return (
        <View style={styles.amenitiesItem}>
          <Ionicons name={icon} size={18} color="#555" />
          <Text style={styles.amenitiesText}>
            <Text style={{ fontWeight: '600' }}>{label} : </Text>
            {value}
          </Text>
        </View>
      );
    },
    [styles],
  );

  const upperFirsts = (str: string | undefined | null) => {
    if (!str) return str;
    return str.replace(/(^\w{1})|(\s+\w{1})/g, (letter) => letter.toUpperCase());
  };
  const amenities = useMemo(
    () =>
      [
        { icon: 'resize', label: 'Surface', value: `${apartment.surface} m²` },
        { icon: 'grid', label: 'Rooms', value: apartment.number_of_rooms },
        { icon: 'bed', label: 'Bedrooms', value: apartment.number_of_bedrooms },
        { icon: 'water', label: 'Bathrooms', value: apartment.number_of_bathrooms },
        { icon: 'car', label: 'Parking Spaces', value: apartment.parking_spaces },
        {
          icon: 'swap-vertical',
          label: 'Elevator',
          value: apartment.has_elevator ? 'Yes' : 'No',
        },
        { icon: 'cube', label: 'Furnished', value: apartment.is_furnished ? 'Yes' : 'No' },
        {
          icon: 'calendar',
          label: 'Available From',
          value: apartment.available_from?.toLocaleString().split('T')[0] ?? null,
        },
        { icon: 'flame', label: 'Heating Type', value: apartment.heating_type },
        { icon: 'thermometer', label: 'Heating Mode', value: apartment.heating_mode },
        { icon: 'leaf', label: 'Energy Class', value: apartment.energy_class },
        { icon: 'stats-chart', label: 'GES', value: apartment.ges },
        { icon: 'chevron-up', label: 'Floor', value: apartment.floor },
        {
          icon: 'compass',
          label: 'Orientation',
          value: apartment.orientation?.replace('_', ' '),
        },
        { icon: 'hammer', label: 'Construction Year', value: apartment.construction_year },
        { icon: 'layers', label: 'Number of Floors', value: apartment.number_of_floors },
      ] as InfoItemProps[],
    [apartment],
  );

  return (
    <>
      <View style={styles.amenitiesContainer}>
        {(showAllAmenities ? amenities : amenities.slice(0, 4)).map((item, index) => {
          if (item.value == null) return null;

          if (typeof item.value === 'string' && item.label !== 'Surface') {
            item.value = upperFirsts(item.value) ?? '';
          }

          return <InfoItem key={index} icon={item.icon} label={item.label} value={item.value} />;
        })}
      </View>
      {apartment && (
        <Pressable onPress={() => setShowAllAmenities(!showAllAmenities)}>
          <Text style={{ color: '#007bff', marginTop: 4 }}>
            {showAllAmenities ? 'Show less' : 'Show more'}
          </Text>
        </Pressable>
      )}
    </>
  );
}

const createStyles = (colors: ColorTheme) =>
  StyleSheet.create({
    amenitiesContainer: {
      padding: 4,
      justifyContent: 'center',
    },
    amenitiesItem: {
      flexDirection: 'row',
      alignItems: 'center',
      marginVertical: 6,
      gap: 5,
    },
    amenitiesText: {
      marginLeft: 6,
      fontSize: 15,
      color: colors.textPrimary,
    },
  });
