import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
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

import { Slider } from '@miblanchard/react-native-slider';
import { usePreventRemove } from '@react-navigation/native';
import GooglePlacesTextInput from 'react-native-google-places-textinput';
import { useSelector } from 'react-redux';

import { ColorTheme } from '@app/Colors';
import { FILTERS_SURFACE_MAX, FILTERS_SURFACE_MIN } from '@app/config/Constants';
import { GOOGLE_API_KEY } from '@app/config/Env';
import { FiltersState, PlaceSearchResponse } from '@app/definitions';
import { useThemeColors } from '@app/hooks/UseThemeColor';
import { setFiltersState } from '@app/redux/slices';
import store, { RootState } from '@app/redux/Store';
import { storageManager } from '@app/internal/Storage';
import { alertUnsaveChangesAsync } from '@app/utils/Misc';
import Loader from '@components/Loader';
import { AccountStackScreenProps } from '@navigation/Types';

const defultPlaceDetails: PlaceSearchResponse = {
  structuredFormat: { mainText: { text: '' } },
} as PlaceSearchResponse;

export default function FiltersScreen({ navigation }: AccountStackScreenProps<'Filters'>) {
  const colors = useThemeColors();
  const styles = createStyles(colors);

  const filtersState = useSelector((state: RootState) => state.filtersState);
  const userId = useSelector((state: RootState) => state.authState.userId);

  const [minSurface, setMinSurface] = useState(FILTERS_SURFACE_MIN);
  const [maxSurface, setMaxSurface] = useState(FILTERS_SURFACE_MAX);
  const [minSurfaceText, setMinSurfaceText] = useState(String(FILTERS_SURFACE_MIN));
  const [maxSurfaceText, setMaxSurfaceText] = useState(String(FILTERS_SURFACE_MAX));
  const [placeDetails, setPlaceDetails] = useState<PlaceSearchResponse>(defultPlaceDetails);
  const [maxPrice, setMaxPrice] = useState('');
  const [isFurnished, setIsFurnished] = useState(false);

  const isApplyingRef = useRef(false);

  const [isLoading, setIsLoading] = useState(false);

  function handleSliderChange([min, max]: number[]) {
    setMinSurface(min);
    setMaxSurface(max);
    setMinSurfaceText(String(min));
    setMaxSurfaceText(String(max));
  }

  const handleSurfaceTextChange = useCallback(
    (text: string, type: 'min' | 'max', blur: boolean) => {
      const setText = type === 'min' ? setMinSurfaceText : setMaxSurfaceText;
      const setSurface = type === 'min' ? setMinSurface : setMaxSurface;
      const min = type === 'min' ? FILTERS_SURFACE_MIN : minSurface;
      const max = type === 'min' ? maxSurface : FILTERS_SURFACE_MAX;

      setText(text);
      const num = parseInt(text, 10);
      if (!isNaN(num)) {
        const clamped = Math.min(Math.max(num, min), max);
        setSurface(clamped);
        if (blur) {
          setText(String(clamped));
        }
      } else if (blur) {
        setText(String(type === 'min' ? minSurface : maxSurface));
      }
    },
    [minSurface, maxSurface],
  );

  async function applyFilters() {
    if (!placeDetails || !placeDetails.structuredFormat.mainText.text || !maxPrice) {
      return Alert.alert(
        'Cannot apply changes.',
        'Please fill in all the fields before continuing.',
      );
    }

    const filters: FiltersState = {
      hasValues: true,
      minSurface: minSurface,
      maxSurface: maxSurface,
      isFurnished: isFurnished,
      maxPrice: parseInt(maxPrice, 10),
      location: {
        name: placeDetails.structuredFormat.mainText.text,
        latitude: placeDetails.details.location.latitude,
        longitude: placeDetails.details.location.longitude,
      },
    };

    setIsLoading(true);
    try {
      await storageManager.setFilters(userId, filters);
      store.dispatch(setFiltersState(filters));
      isApplyingRef.current = true;
      Keyboard.dismiss();
      navigation.goBack();
    } finally {
      setIsLoading(false);
    }
  }

  const hasChanges = useMemo(() => {
    if (isApplyingRef.current) {
      return false;
    }

    return (
      minSurface !== filtersState.minSurface ||
      maxSurface !== filtersState.maxSurface ||
      parseInt(maxPrice, 10) !== filtersState.maxPrice ||
      isFurnished !== filtersState.isFurnished ||
      placeDetails?.structuredFormat.mainText.text !== filtersState.location?.name
    );
  }, [
    filtersState,
    minSurface,
    maxSurface,
    maxPrice,
    isFurnished,
    placeDetails.structuredFormat.mainText.text,
  ]);

  useEffect(() => {
    async function loadFilters() {
      setIsLoading(true);
      try {
        const stored = filtersState.hasValues
          ? filtersState
          : await storageManager.getFilters(userId);

        if (stored && stored.hasValues) {
          store.dispatch(setFiltersState(stored));
          setMinSurface(stored.minSurface);
          setMaxSurface(stored.maxSurface);
          setMinSurfaceText(String(stored.minSurface));
          setMaxSurfaceText(String(stored.maxSurface));
          setMaxPrice(String(stored.maxPrice));
          setIsFurnished(stored.isFurnished);
          setPlaceDetails({
            structuredFormat: { mainText: { text: stored.location.name } },
            details: {
              location: {
                latitude: stored.location.latitude,
                longitude: stored.location.longitude,
              },
            },
          } as PlaceSearchResponse);
        }
      } finally {
        setIsLoading(false);
      }
    }

    loadFilters();
  }, [filtersState, userId]);

  usePreventRemove(hasChanges, async (options) => {
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
              onChangeText={(text) => handleSurfaceTextChange(text, 'min', false)}
              onBlur={() => handleSurfaceTextChange(minSurfaceText, 'min', true)}
            />
          </View>

          <View style={styles.surfaceInputContainer}>
            <Text style={styles.surfaceLabel}>Maximum</Text>
            <TextInput
              style={styles.surfaceInput}
              keyboardType="numeric"
              value={maxSurfaceText}
              onChangeText={(text) => handleSurfaceTextChange(text, 'max', false)}
              onBlur={() => handleSurfaceTextChange(maxSurfaceText, 'max', true)}
            />
          </View>
        </View>

        {/* ======== Address ======== */}
        <Text style={styles.sectionTitle}>Address</Text>
        <GooglePlacesTextInput
          apiKey={GOOGLE_API_KEY}
          value={placeDetails.structuredFormat.mainText.text}
          placeHolderText="Enter an address"
          languageCode="fr"
          includedRegionCodes={['fr']}
          minCharsToFetch={2}
          fetchDetails={true}
          detailsFields={['formattedAddress', 'location']}
          onTextChange={(text) =>
            setPlaceDetails(
              (old) =>
                ({
                  ...old,
                  structuredFormat: { mainText: { text } },
                }) as PlaceSearchResponse,
            )
          }
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

        {/* ======== Furnitures ======== */}
        <Text style={styles.sectionTitle}>Furnitures</Text>
        <TouchableOpacity
          style={styles.isFurnishedContainer}
          onPress={() => setIsFurnished(!isFurnished)}>
          <View
            style={[
              styles.isFurnishedButton,
              { backgroundColor: isFurnished ? colors.primary : 'transparent' },
            ]}
          />
          <Text style={{ color: colors.textPrimary, fontSize: 16 }}>
            Only show furnished apartments
          </Text>
        </TouchableOpacity>

        {/* ======== Buttons ======== */}
        {hasChanges ? (
          <TouchableOpacity
            style={[styles.button, { backgroundColor: colors.primary }]}
            onPress={applyFilters}>
            <Text style={styles.buttonText}>Apply</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={[styles.button, { backgroundColor: 'lightgrey' }]}
            onPress={navigation.goBack}>
            <Text style={styles.buttonText}>Cancel</Text>
          </TouchableOpacity>
        )}
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

    isFurnishedContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      marginTop: 10,
    },

    isFurnishedButton: {
      width: 24,
      height: 24,
      borderRadius: 4,
      borderWidth: 1,
      borderColor: colors.contrast,
      marginRight: 10,
    },

    button: {
      backgroundColor: colors.primary,
      alignItems: 'center',
      paddingVertical: 10,
      marginTop: 20,
      borderRadius: 8,
      borderWidth: 1,
      elevation: 3,
    },
    buttonText: {
      color: colors.textPrimary,
      fontWeight: '600',
      fontSize: 16,
    },
  });
