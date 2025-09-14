import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { ProfileStackScreenProps } from '@navigation/Types';

export default function FiltersScreen(_: ProfileStackScreenProps<'Filters'>) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Filters</Text>
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
