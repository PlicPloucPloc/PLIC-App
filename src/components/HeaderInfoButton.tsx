import React from 'react';
import { TouchableOpacity } from 'react-native';

import { Ionicons } from '@expo/vector-icons';

import { IoniconName } from '@app/definitions';

type HeaderRefresButtonProps = {
  icon: IoniconName;
  onPress?: () => void;
};

export default function HeaderInfoButton({ icon, onPress }: HeaderRefresButtonProps) {
  return (
    <TouchableOpacity onPress={onPress} style={{ marginRight: 15 }}>
      <Ionicons name={icon} size={28} color="black" />
    </TouchableOpacity>
  );
}
