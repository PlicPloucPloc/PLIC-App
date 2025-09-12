import React, { memo } from 'react';
import { Alert, Animated, Pressable, StyleSheet, Text, TouchableOpacity } from 'react-native';

import { ColorTheme } from '@app/Colors';
import { RelationInfo } from '@app/definitions';
import { useThemeColors } from '@app/hooks/UseThemeColor';
import { Swipeable } from 'react-native-gesture-handler';

import ApartmentListItem from './ApartmentListItem';

type Props = {
  relation: RelationInfo;
  onPress: (relation: RelationInfo) => void;
  onDelete: (apartmentId: number) => void;
  isHistory: boolean;
};

const ApartmentListRow = memo(({ relation, onPress, onDelete, isHistory }: Props) => {
  const colors = useThemeColors();
  const styles = createStyles(colors);

  const renderLeftActions = (progress: Animated.AnimatedInterpolation<number>) => {
    const translateX = progress.interpolate({
      inputRange: [0, 1],
      outputRange: [-100, 0],
    });

    return (
      <Animated.View style={[styles.rightAction, { transform: [{ translateX }] }]}>
        <TouchableOpacity
          onPress={() => {
            Alert.alert(
              'Confirm Deletion',
              'Are you sure you want to delete the apartment from your likes?',
              [
                { text: 'Cancel', style: 'cancel' },
                {
                  text: 'Delete',
                  style: 'destructive',
                  onPress: () => onDelete(relation.apt.apartment_id),
                },
              ],
            );
          }}
          style={styles.actionTouchable}>
          <Text style={styles.actionText}>Delete</Text>
        </TouchableOpacity>
      </Animated.View>
    );
  };

  return (
    <Swipeable renderLeftActions={renderLeftActions}>
      <Pressable
        onPress={() => onPress(relation)}
        android_ripple={{ color: `${colors.primary}50` }}
        unstable_pressDelay={100}>
        <ApartmentListItem
          title={relation.apt.name}
          surface={relation.apt.surface}
          rent={relation.apt.rent}
          location={relation.apt.location}
          imageUrl={relation.apt.image_thumbnail}
          relationType={isHistory ? relation.type : undefined}
        />
      </Pressable>
    </Swipeable>
  );
});

export default ApartmentListRow;

const createStyles = (_: ColorTheme) =>
  StyleSheet.create({
    rightAction: {
      width: 100,
      height: '100%',
      justifyContent: 'center',
      alignItems: 'center',
      padding: 10,
    },
    actionTouchable: {
      flex: 1,
      width: '100%',
      justifyContent: 'center',
      alignItems: 'center',
      borderRadius: 10,
      backgroundColor: 'red',
    },
    actionText: {
      color: '#fff',
      fontWeight: 'bold',
    },
  });
