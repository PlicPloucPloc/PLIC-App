import React from 'react';
import { Switch } from 'react-native';

import { useThemeColors } from '@app/hooks/UseThemeColor';

type HeaderSwitchProps = {
  onValueChange?: (value: boolean) => void;
  value?: boolean;
};

export default function HeaderSwitch({ onValueChange, value }: HeaderSwitchProps) {
  const colors = useThemeColors();

  return (
    <Switch
      style={{ marginRight: 15 }}
      trackColor={{ true: colors.primary }}
      thumbColor={colors.primary}
      onValueChange={onValueChange}
      value={value}
    />
  );
}
