import React from 'react';
import { Keyboard, TouchableOpacity } from 'react-native';

import { Ionicons } from '@expo/vector-icons';
import { ParamListBase } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';

type HeaderBackButtonProps = {
  navigation: StackNavigationProp<ParamListBase>;
};

export default function HeaderBackButton({ navigation }: HeaderBackButtonProps) {
  return (
    <TouchableOpacity
      onPress={() => {
        Keyboard.dismiss();
        navigation.goBack();
      }}
      style={{ paddingHorizontal: 15 }}>
      <Ionicons name="arrow-back-outline" size={28} color="black" />
    </TouchableOpacity>
  );
}
