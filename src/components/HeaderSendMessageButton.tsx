import React from 'react';
import { TouchableOpacity } from 'react-native';

import { Ionicons } from '@expo/vector-icons';

import { IoniconName } from '@app/definitions';

type HeaderSendMessageButtonProps = {
  icon: IoniconName;
  onPress?: () => void;
};

export default function HeaderSendMessageButton({ icon, onPress }: HeaderSendMessageButtonProps) {
  return (
    <TouchableOpacity onPress={onPress} style={{ marginRight: 15 }}>
      <Ionicons name={icon} size={26} color="black" />
    </TouchableOpacity>
  );
}
