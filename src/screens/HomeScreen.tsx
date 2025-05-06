import React from 'react';
import { Button, StyleSheet, Text, View } from 'react-native';

import { HomeStackScreenProps } from '@navigation/Types';

export default function HomeScreen({ navigation }: HomeStackScreenProps<'Home'>) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Home screen !</Text>
      <Button
        title="See house detail"
        onPress={() =>
          navigation.navigate('SharedStack', {
            screen: 'HouseDetails',
            params: { houseId: 69 },
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
