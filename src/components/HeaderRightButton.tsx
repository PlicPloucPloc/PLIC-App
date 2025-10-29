import React from 'react';
import { TouchableOpacity } from 'react-native';

import { Ionicons } from '@expo/vector-icons';

import { IoniconName } from '@app/definitions';

type HeaderRightButtonProps = {
  icon: IoniconName;
  onPress?: () => void;
};

export default function HeaderRightButton({ icon, onPress }: HeaderRightButtonProps) {
  return (
    <TouchableOpacity onPress={onPress} style={{ paddingHorizontal: 15 }}>
      <Ionicons name={icon} size={28} color="black" />
    </TouchableOpacity>
  );
}
