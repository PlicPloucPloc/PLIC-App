import React, { forwardRef, useCallback, useImperativeHandle, useState } from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';

import { ColorTheme } from '@app/Colors';
import { useThemeColors } from '@app/hooks/UseThemeColor';
import { Slider } from '@miblanchard/react-native-slider';

export interface SurfaceSliderRef {
  resetValues: (newMin: number, newMax: number) => void;
  minValue: number;
  maxValue: number;
}

interface SurfaceSliderProps {
  minValue: number;
  maxValue: number;
}

const SurfaceSlider = forwardRef<SurfaceSliderRef, SurfaceSliderProps>(
  ({ minValue, maxValue }, ref) => {
    const colors = useThemeColors();
    const styles = createStyles(colors);

    const [minSurface, setMinSurface] = useState(minValue);
    const [maxSurface, setMaxSurface] = useState(maxValue);
    const [minSurfaceText, setMinSurfaceText] = useState(String(minValue));
    const [maxSurfaceText, setMaxSurfaceText] = useState(String(maxValue));

    const clamp = (value: number, min: number, max: number) => Math.min(Math.max(value, min), max);

    const handleSliderChange = useCallback(([min, max]: number[]) => {
      setMinSurface(min);
      setMaxSurface(max);
      setMinSurfaceText(String(min));
      setMaxSurfaceText(String(max));
    }, []);

    const handleMinChange = useCallback(
      (text: string, blur: boolean) => {
        setMinSurfaceText(text);
        const num = parseInt(text, 10);
        if (!isNaN(num)) {
          const clamped = clamp(num, minValue, maxSurface);
          setMinSurface(clamped);
          if (blur) setMinSurfaceText(String(clamped));
        }
      },
      [minValue, maxSurface],
    );

    const handleMaxChange = useCallback(
      (text: string, blur: boolean) => {
        setMaxSurfaceText(text);
        const num = parseInt(text, 10);
        if (!isNaN(num)) {
          const clamped = clamp(num, minSurface, maxValue);
          setMaxSurface(clamped);
          if (blur) setMaxSurfaceText(String(clamped));
        }
      },
      [minSurface, maxValue],
    );

    useImperativeHandle(ref, () => ({
      resetValues: (newMin: number, newMax: number) => {
        console.log('SurfaceSlider resetValues called with:', { newMin, newMax });
        setMinSurface(newMin);
        setMaxSurface(newMax);
        setMinSurfaceText(String(newMin));
        setMaxSurfaceText(String(newMax));
      },
      minValue: minSurface,
      maxValue: maxSurface,
    }));

    console.log('Rendering SurfaceSlider with:', { minSurface, maxSurface });
    return (
      <View>
        <Slider
          value={[minSurface, maxSurface]}
          onValueChange={handleSliderChange}
          minimumValue={minValue}
          maximumValue={maxValue}
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
      </View>
    );
  },
);

export default SurfaceSlider;

const createStyles = (colors: ColorTheme) =>
  StyleSheet.create({
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
  });
