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
        title="user 1"
        onPress={() =>
          navigation.navigate('SharedStack', {
            screen: 'OtherProfile',
            params: { userId: '132-654-sfj' },
          })
        }
      />
      <Button
        title="user 2"
        onPress={() =>
          navigation.navigate('SharedStack', {
            screen: 'OtherProfile',
            params: { userId: '987-321-fgh' },
          })
        }
      />
      <Button
        title="user 3"
        onPress={() =>
          navigation.navigate('SharedStack', {
            screen: 'OtherProfile',
            params: { userId: '456-789-dfg' },
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
