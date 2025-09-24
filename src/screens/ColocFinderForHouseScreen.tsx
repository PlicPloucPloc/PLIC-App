import React from 'react';
import { Button, StyleSheet, Text, View } from 'react-native';

import { ColocFinderStackScreenProps } from '@navigation/Types';

export default function ColocFinderForHouseScreen({
  navigation,
  route,
}: ColocFinderStackScreenProps<'ColocFinderForHouse'>) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Find coloc for house: {route.params.houseId}</Text>
      <Button
        title="Romain Doulaud"
        onPress={() =>
          navigation.navigate('SharedStack', {
            screen: 'OtherProfile',
            params: { userId: 'a3c0e18a-2f24-4eaa-82cc-9d29c8e509e1' },
          })
        }
      />
      <Button
        title="Romano Pepito"
        onPress={() =>
          navigation.navigate('SharedStack', {
            screen: 'OtherProfile',
            params: { userId: '7c8ce8e3-a3af-407f-a34c-0931422a71c1' },
          })
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
});
