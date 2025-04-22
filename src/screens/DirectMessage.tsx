import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { SharedStackScreenProps } from '../navigation/Types';

export default function DirectMessageScreen({ route }: SharedStackScreenProps<'DirectMessage'>) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Message with user {route.params.userId}</Text>
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
