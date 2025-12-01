import React, { memo, useCallback } from 'react';
import { Alert, Pressable } from 'react-native';

import Swipeable from 'react-native-gesture-handler/ReanimatedSwipeable';
import { SharedValue } from 'react-native-reanimated';

import { RelationInfo } from '@app/definitions';
import { useThemeColors } from '@app/hooks/UseThemeColor';

import ApartmentListItem from './ApartmentListItem';
import RightActionDelete from './RightActionDelete';

type Props = {
  relation: RelationInfo;
  onPress: (relation: RelationInfo) => void;
  onDelete: (apartmentId: number) => void;
  isHistory: boolean;
};

const ApartmentListRow = memo(({ relation, onPress, onDelete, isHistory }: Props) => {
  const colors = useThemeColors();

  const confirmDelete = useCallback(() => {
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
  }, [onDelete, relation.apt.apartment_id]);

  const renderItem = (
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

  return isHistory ? (
    <Swipeable
      renderRightActions={(_, drag: SharedValue<number>) => (
        <RightActionDelete drag={drag} onPress={confirmDelete} />
      )}>
      {renderItem}
    </Swipeable>
  ) : (
    renderItem
  );
});

ApartmentListRow.displayName = 'ApartmentListRow';

export default ApartmentListRow;
