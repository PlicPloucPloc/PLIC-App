import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  Alert,
  Keyboard,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';

import { ColorTheme } from '@app/Colors';
import { FILTERS_SURFACE_MAX, FILTERS_SURFACE_MIN } from '@app/config/Constants';
import { GOOGLE_API_KEY } from '@app/config/Env';
import { FiltersState, PlaceSearchResponse } from '@app/definitions';
import { useThemeColors } from '@app/hooks/UseThemeColor';
import { setFiltersState } from '@app/redux/slices';
import store, { RootState } from '@app/redux/Store';
import { alertUnsaveChangesAsync } from '@app/utils/Misc';
import Loader from '@components/Loader';
import SurfaceSlider, { SurfaceSliderRef } from '@components/SurfaceSlider';
import { AccountStackScreenProps } from '@navigation/Types';
import AsyncStorage from '@react-native-async-storage/async-storage';
import GooglePlacesTextInput from 'react-native-google-places-textinput';
import { useSelector } from 'react-redux';

export default function FiltersScreen({ navigation }: AccountStackScreenProps<'Filters'>) {
  const colors = useThemeColors();
  const styles = createStyles(colors);

  const sliderRef = useRef<SurfaceSliderRef>(null);

  const [placeDetails, setPlaceDetails] = useState<PlaceSearchResponse | null>(null);
  const [maxPrice, setMaxPrice] = useState('');

  const [isLoading, setIsLoading] = useState(false);
  const filterState = useSelector((state: RootState) => state.filtersState);

  async function applyFilters() {
    if (!sliderRef.current || !placeDetails || !maxPrice) {
      Alert.alert('Cannot apply changes.', 'Please fill in all the fields before continuing.');
      return;
    }

    const filters: FiltersState = {
      hasValues: true,
      minSurface: sliderRef.current.minValue,
      maxSurface: sliderRef.current.maxValue,
      maxPrice: parseInt(maxPrice, 10),
      location: {
        name: placeDetails.structuredFormat.mainText.text,
        latitude: placeDetails.details.location.latitude,
        longitude: placeDetails.details.location.longitude,
      },
    };

    setIsLoading(true);
    try {
      await AsyncStorage.setItem('apartmentFilters', JSON.stringify(filters));
      store.dispatch(setFiltersState(filters));
      navigation.goBack();
    } finally {
      setIsLoading(false);
    }
  }

  function clearFilters() {
    setPlaceDetails(null);
    setMaxPrice('');
    sliderRef.current?.resetValues(FILTERS_SURFACE_MIN, FILTERS_SURFACE_MAX);
  }

  useEffect(() => {
    const setValues = (filters: FiltersState) => {
      sliderRef.current?.resetValues(filters.minSurface, filters.maxSurface);
      setMaxPrice(String(filters.maxPrice) ?? '');
      setPlaceDetails({
        structuredFormat: { mainText: { text: filters.location.name } },
        details: {
          location: {
            latitude: filters.location.latitude,
            longitude: filters.location.longitude,
          },
        },
      } as PlaceSearchResponse);
    };

    (async () => {
      setIsLoading(true);
      try {
        // try for redux first and then for async storage
        if (filterState.hasValues) {
          console.log('Loading filters from redux');
          setValues(filterState);
        } else {
          console.log('Loading filters from async storage');
          const filters = await AsyncStorage.getItem('apartmentFilters');
          if (filters) {
            console.log('Filters found in async storage', filters);
            const parsedFilters: FiltersState = JSON.parse(filters);
            store.dispatch(setFiltersState(parsedFilters));
            setValues(parsedFilters);
          }
        }
      } finally {
        setIsLoading(false);
      }
    })();
  }, [filterState]);

  const hasChanges = useCallback(() => {
    console.log('======== Checking for unsaved changes ========');
    console.log(filterState);
    console.log('Current min surface:', sliderRef.current?.minValue);
    console.log('Current max surface:', sliderRef.current?.maxValue);
    console.log('Current max price:', parseInt(maxPrice, 10));
    console.log('Current location:', placeDetails?.structuredFormat?.mainText?.text);

    if (sliderRef.current?.minValue !== filterState.minSurface) {
      console.log('Min surface changed');
    }
    if (sliderRef.current?.maxValue !== filterState.maxSurface) {
      console.log('Max surface changed');
    }
    if (parseInt(maxPrice, 10) !== filterState.maxPrice) {
      console.log('Max price changed');
    }
    if (placeDetails?.structuredFormat?.mainText?.text !== filterState.location?.name) {
      console.log('Location changed');
    }

    const changes =
      sliderRef.current?.minValue !== filterState.minSurface ||
      sliderRef.current?.maxValue !== filterState.maxSurface ||
      parseInt(maxPrice, 10) !== filterState.maxPrice ||
      placeDetails?.structuredFormat?.mainText?.text !== filterState.location?.name;

    console.log('Has changes:', changes);
    return changes;
  }, [filterState, maxPrice, placeDetails]);

  useEffect(() => {
    const beforeRemoveListener = navigation.addListener('beforeRemove', async (e) => {
      if (!hasChanges()) {
        return;
      }

      e.preventDefault();
      if (await alertUnsaveChangesAsync()) {
        navigation.dispatch(e.data.action);
      }
    });

    return () => {
      beforeRemoveListener();
    };
  }, [navigation, hasChanges]);

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} style={styles.container}>
      <View style={styles.container}>
        <Loader loading={isLoading} />

        <Text style={[styles.sectionTitle, { marginTop: 10 }]}>Surface area (m²)</Text>
        <SurfaceSlider
          ref={sliderRef}
          minValue={FILTERS_SURFACE_MIN}
          maxValue={FILTERS_SURFACE_MAX}
        />

        <Text style={styles.sectionTitle}>Address</Text>
        <GooglePlacesTextInput
          apiKey={GOOGLE_API_KEY}
          value={placeDetails?.structuredFormat.mainText.text ?? ''}
          placeHolderText="Enter an address"
          languageCode="fr"
          includedRegionCodes={['fr']}
          minCharsToFetch={2}
          fetchDetails={true}
          detailsFields={['formattedAddress', 'location']}
          onPlaceSelect={(place: any) => {
            // leave 'any' as it allows type conversion
            setPlaceDetails(place);
          }}
        />

        <Text style={styles.sectionTitle}>Maximum price (€)</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter maximum price"
          placeholderTextColor={colors.textSecondary}
          value={maxPrice}
          onChangeText={(value) => setMaxPrice(value.replace(/[^0-9]/g, ''))}
          maxLength={7}
          keyboardType="numeric"
        />

        <View style={styles.buttonsContainer}>
          <TouchableOpacity
            style={[styles.buttons, { backgroundColor: colors.backgroundSecondary }]}
            onPress={clearFilters}>
            <Text style={[styles.buttonText, { color: colors.textPrimary }]}>Clear</Text>
          </TouchableOpacity>

          {hasChanges() ? (
            <TouchableOpacity
              style={[styles.buttons, { backgroundColor: colors.primary }]}
              onPress={applyFilters}>
              <Text style={[styles.buttonText, { color: colors.textPrimary }]}>Apply</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              style={[styles.buttons, { backgroundColor: 'lightgrey' }]}
              onPress={applyFilters}>
              <Text style={[styles.buttonText, { color: colors.textPrimary }]}>Cancel</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
}

const createStyles = (colors: ColorTheme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
      paddingHorizontal: 20,
    },
    sectionTitle: {
      fontSize: 20,
      fontWeight: 'bold',
      color: colors.textPrimary,
      marginTop: 20,
      marginBottom: 10,
    },

    input: {
      width: '100%',
      padding: 12,
      borderWidth: 1,
      borderColor: colors.contrast,
      borderRadius: 10,
      fontSize: 16,
      color: colors.textPrimary,
    },

    buttonsContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginTop: 30,
    },
    buttons: {
      flex: 1,
      marginHorizontal: 9,
      alignItems: 'center',
      paddingVertical: 15,
      borderRadius: 8,
      borderWidth: 1,
      elevation: 3,
    },
    buttonText: {
      fontWeight: '600',
      fontSize: 16,
    },
  });
