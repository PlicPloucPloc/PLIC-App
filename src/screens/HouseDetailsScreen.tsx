import React from 'react';
import { Button, StyleSheet, Text, View } from 'react-native';
import { SharedStackScreenProps } from '../navigation/Types';

export default function HouseDetailsScreen({
  navigation,
  route,
}: SharedStackScreenProps<'HouseDetails'>) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Details of house: {route.params.houseId}</Text>
      <Button
        title="Go to owner profil"
        onPress={() => navigation.navigate('OtherProfil', { userId: 42 })}
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
