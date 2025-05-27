import React from 'react';
import { Button, StyleSheet, Text, View } from 'react-native';

import { LikesStackScreenProps } from '@navigation/Types';

export default function LikesListScreen({ navigation }: LikesStackScreenProps<'LikesList'>) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Likes List</Text>
      <Button
        title="Go to details of house 1"
        onPress={() =>
          navigation.navigate('SharedStack', {
            screen: 'ApartmentDetails',
            params: { apartmentId: 1 },
          })
        }
      />
      <Button
        title="Go to details of house 2"
        onPress={() =>
          navigation.navigate('SharedStack', {
            screen: 'ApartmentDetails',
            params: { apartmentId: 2 },
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
