import React from 'react';
import { Button, StyleSheet, Text, View } from 'react-native';

import { ProfilStackScreenProps } from '@navigation/Types';

export default function HistoryScreen({ navigation }: ProfilStackScreenProps<'History'>) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>History</Text>
      <Button
        title="See details of liked house 42"
        onPress={() =>
          navigation.navigate('SharedStack', {
            screen: 'HouseDetails',
            params: { houseId: 42 },
          })
        }
      />
      <Button
        title="See details of liked house 69"
        onPress={() =>
          navigation.navigate('SharedStack', {
            screen: 'HouseDetails',
            params: { houseId: 69 },
          })
        }
      />
      <Button
        title="See details of diliked house 1234"
        onPress={() =>
          navigation.navigate('SharedStack', {
            screen: 'HouseDetails',
            params: { houseId: 1234 },
          })
        }
      />
      <Button
        title="See details of liked house 90"
        onPress={() =>
          navigation.navigate('SharedStack', {
            screen: 'HouseDetails',
            params: { houseId: 90 },
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
