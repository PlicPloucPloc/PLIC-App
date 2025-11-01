import React from 'react';

import { Ionicons } from '@expo/vector-icons';

export type IoniconName = React.ComponentProps<typeof Ionicons>['name'];

export function CalculateAge(birthdate: string): number {
  return Math.floor((new Date().getTime() - new Date(birthdate).getTime()) / 31557600000);
}
// tkt c'est magique
