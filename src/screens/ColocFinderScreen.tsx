import React from 'react';
import { Button, StyleSheet, Text, View } from 'react-native';
import { ColocFinderStackScreenProps } from '../navigation/Types';

export default function ColocFinderScreen({
  navigation,
}: ColocFinderStackScreenProps<'ColocFinder'>) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Coloc finder</Text>
      <Button
        title="Find coloc for house 42"
        onPress={() => navigation.navigate('ColocFinderForHouse', { houseId: 42 })}
      />
      <Button
        title="Find coloc for house 69"
        onPress={() => navigation.navigate('ColocFinderForHouse', { houseId: 69 })}
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
