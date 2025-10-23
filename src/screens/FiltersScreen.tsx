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
import { Slider } from '@miblanchard/react-native-slider';
import { AccountStackScreenProps } from '@navigation/Types';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { usePreventRemove } from '@react-navigation/native';
import GooglePlacesTextInput from 'react-native-google-places-textinput';
import { useSelector } from 'react-redux';

export default function FiltersScreen({ navigation }: AccountStackScreenProps<'Filters'>) {
  const colors = useThemeColors();
  const styles = createStyles(colors);

  const filtersState = useSelector((state: RootState) => state.filtersState);

  const [minSurface, setMinSurface] = useState(FILTERS_SURFACE_MIN);
  const [maxSurface, setMaxSurface] = useState(FILTERS_SURFACE_MAX);
  const [minSurfaceText, setMinSurfaceText] = useState(String(FILTERS_SURFACE_MIN));
  const [maxSurfaceText, setMaxSurfaceText] = useState(String(FILTERS_SURFACE_MAX));
  const [placeDetails, setPlaceDetails] = useState<PlaceSearchResponse | null>(null);
  const [maxPrice, setMaxPrice] = useState('');

  const isApplyingRef = useRef(false);

  const [isLoading, setIsLoading] = useState(false);

  const handleSliderChange = useCallback(([min, max]: number[]) => {
    setMinSurface(min);
    setMaxSurface(max);
    setMinSurfaceText(String(min));
    setMaxSurfaceText(String(max));
  }, []);

  const clamp = (value: number, min: number, max: number) => Math.min(Math.max(value, min), max);

  const handleMinChange = useCallback(
    (text: string, blur: boolean) => {
      setMinSurfaceText(text);
      const num = parseInt(text, 10);
      if (!isNaN(num)) {
        const clamped = clamp(num, FILTERS_SURFACE_MIN, maxSurface);
        setMinSurface(clamped);
        if (blur) {
          setMinSurfaceText(String(clamped));
        }
      }
    },
    [maxSurface],
  );

  const handleMaxChange = useCallback(
    (text: string, blur: boolean) => {
      setMaxSurfaceText(text);
      const num = parseInt(text, 10);
      if (!isNaN(num)) {
        const clamped = clamp(num, minSurface, FILTERS_SURFACE_MAX);
        setMaxSurface(clamped);
        if (blur) {
          setMaxSurfaceText(String(clamped));
        }
      }
    },
    [minSurface],
  );

  async function applyFilters() {
    if (!placeDetails || !maxPrice) {
      return Alert.alert(
        'Cannot apply changes.',
        'Please fill in all the fields before continuing.',
      );
    }

    const filters: FiltersState = {
      hasValues: true,
      minSurface: minSurface,
      maxSurface: maxSurface,
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
      isApplyingRef.current = true;
      navigation.goBack();
    } finally {
      setIsLoading(false);
    }
  }

  function clearFilters() {
    setMinSurface(FILTERS_SURFACE_MIN);
    setMaxSurface(FILTERS_SURFACE_MAX);
    setMinSurfaceText(String(FILTERS_SURFACE_MIN));
    setMaxSurfaceText(String(FILTERS_SURFACE_MAX));
    setPlaceDetails(null);
    setMaxPrice('');
  }

  useEffect(() => {
    const setValues = (filters: FiltersState) => {
      setMinSurface(filters.minSurface);
      setMaxSurface(filters.maxSurface);
      setMinSurfaceText(String(filters.minSurface));
      setMaxSurfaceText(String(filters.maxSurface));
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
        if (filtersState.hasValues) {
          setValues(filtersState);
        } else {
          const filters = await AsyncStorage.getItem('apartmentFilters');
          if (filters) {
            const parsedFilters: FiltersState = JSON.parse(filters);
            store.dispatch(setFiltersState(parsedFilters));
            setValues(parsedFilters);
          }
        }
      } finally {
        setIsLoading(false);
      }
    })();
  }, [filtersState]);

  const hasChanges = useCallback(() => {
    if (isApplyingRef.current) {
      return false;
    }

    return (
      minSurface !== filtersState.minSurface ||
      maxSurface !== filtersState.maxSurface ||
      parseInt(maxPrice, 10) !== filtersState.maxPrice ||
      placeDetails?.structuredFormat.mainText.text !== filtersState.location?.name
    );
  }, [filtersState, maxPrice, placeDetails, minSurface, maxSurface]);

  usePreventRemove(hasChanges(), async (options) => {
    if (isApplyingRef.current || (await alertUnsaveChangesAsync())) {
      navigation.dispatch(options.data.action);
    }
  });

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} style={styles.container}>
      <View style={styles.container}>
        <Loader loading={isLoading} />

        {/* ======== Surface ======== */}
        <Text style={[styles.sectionTitle, { marginTop: 10 }]}>Surface area (m²)</Text>
        <Slider
          value={[minSurface, maxSurface]}
          onValueChange={handleSliderChange}
          minimumValue={FILTERS_SURFACE_MIN}
          maximumValue={FILTERS_SURFACE_MAX}
          step={1}
          maximumTrackTintColor={colors.textSecondary}
          minimumTrackTintColor={colors.primary}
          thumbTintColor={colors.primary}
          animateTransitions
        />

        <View style={styles.surfaceInputsRow}>
          <View style={styles.surfaceInputContainer}>
            <Text style={styles.surfaceLabel}>Minimum</Text>
            <TextInput
              style={styles.surfaceInput}
              keyboardType="numeric"
              value={minSurfaceText}
              onChangeText={(text) => handleMinChange(text, false)}
              onBlur={() => handleMinChange(minSurfaceText, true)}
            />
          </View>

          <View style={styles.surfaceInputContainer}>
            <Text style={styles.surfaceLabel}>Maximum</Text>
            <TextInput
              style={styles.surfaceInput}
              keyboardType="numeric"
              value={maxSurfaceText}
              onChangeText={(text) => handleMaxChange(text, false)}
              onBlur={() => handleMaxChange(maxSurfaceText, true)}
            />
          </View>
        </View>

        {/* ======== Address ======== */}
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

        {/* ======== Maximum price ======== */}
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

        {/* ======== Buttons ======== */}
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
              onPress={navigation.goBack}>
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

    surfaceInputsRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
    surfaceInputContainer: {
      width: '30%',
    },
    surfaceLabel: {
      color: colors.textSecondary,
      fontSize: 14,
      marginBottom: 5,
      textAlign: 'center',
    },
    surfaceInput: {
      color: colors.textPrimary,
      borderColor: colors.contrast,
      borderWidth: 1,
      borderRadius: 8,
      padding: 8,
      fontSize: 16,
      textAlign: 'center',
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
