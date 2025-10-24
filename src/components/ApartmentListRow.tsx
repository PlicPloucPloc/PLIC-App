import React, { memo } from 'react';
import { Alert, Pressable, StyleSheet, Text, TouchableOpacity } from 'react-native';

import Swipeable from 'react-native-gesture-handler/ReanimatedSwipeable';
import Reanimated, { SharedValue, useAnimatedStyle } from 'react-native-reanimated';

import { ColorTheme } from '@app/Colors';
import { RelationInfo } from '@app/definitions';
import { useThemeColors } from '@app/hooks/UseThemeColor';

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

  function RightAction(prog: SharedValue<number>, drag: SharedValue<number>) {
    const styleAnimation = useAnimatedStyle(() => {
      return {
        transform: [{ translateX: drag.value + 100 }],
      };
    });

    return (
      <Reanimated.View style={[styles.rightAction, styleAnimation]}>
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
      </Reanimated.View>
    );
  }

  if (!isHistory) {
    return (
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
    );
  }

  return (
    <Swipeable renderRightActions={RightAction}>
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

ApartmentListRow.displayName = 'ApartmentListRow';

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
